import { useState, useEffect } from 'react'
import boardService from '@/services/boardService'
import leadService from '@/services/leadService'
import columnService from '@/services/boardCollunService'

const useKanban = () => {
  const [boards, setBoards] = useState([])
  const [selectedBoard, setSelectedBoard] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [leads, setLeads] = useState([])
  const [statuses, setStatuses] = useState([])
  const [columns, setColumns] = useState([])
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const addLead = newLead => {
    setLeads(prevLeads => [...prevLeads, newLead])
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const fetchBoards = async () => {
    setLoading(true)
    try {
      const data = await boardService.getBoards()
      setBoards(data)

      if (data.results && data.results.length > 0 && !selectedBoard) {
        setSelectedBoard(data.results[0].id)
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar os boards')
    } finally {
      setLoading(false)
    }
  }

  const fetchBoardDetails = async boardId => {
    if (!boardId) return

    setLoading(true)
    try {
      const board = boards.results.find(b => b.id === boardId)

      if (board) {
        setColumns(board.columns || [])

        const sortedColumns = board.columns.sort((a, b) => a.position - b.position)
        setLeads(sortedColumns.flatMap(column => column.leads || []))
        setStatuses(
          sortedColumns.map(column => ({
            id: column.id,
            name: column.name,
            position: column.position,
          })),
        )
      }
    } catch (err) {
      setError('Erro ao buscar detalhes do board selecionado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoardDetails(selectedBoard)
  }, [selectedBoard, boards])

  useEffect(() => {
    fetchBoards()
  }, [])

  const reloadBoardDetails = async () => {
    await fetchBoardDetails(selectedBoard)
  }

  const updateLeadColumn = async (leadId, newColumnId) => {
    try {
      await leadService.patchLead(leadId, { column_id: newColumnId })

      setLeads(prevLeads => {
        const updatedLeads = prevLeads.map(lead => {
          if (lead.id === leadId) {
            return { ...lead, column_id: newColumnId }
          }
          return lead
        })
        return updatedLeads
      })

      await reloadBoardDetails()
    } catch (err) {
      console.error('Erro ao atualizar o status do lead:', err.message || err)
    }
  }

  const handleDeleteLead = async leadId => {
    try {
      await boardService.deleteLead(leadId)
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId))
      setSnackbarMessage('Lead excluído com sucesso!')
      setSnackbarOpen(true)

      await reloadBoardDetails()
    } catch (error) {
      console.error('Erro ao excluir lead:', error)
      setSnackbarMessage('Erro ao excluir lead.')
      setSnackbarOpen(true)
    }
  }

  const handleUpdateLead = async updatedLead => {
    try {
      await leadService.patchLead(updatedLead.id, updatedLead)
      setLeads(prevLeads =>
        prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead)),
      )
      setSnackbarMessage('Lead atualizado com sucesso!')
      setSnackbarOpen(true)

      await reloadBoardDetails()
    } catch (error) {
      console.error('Erro ao atualizar lead:', error)
      setSnackbarMessage('Erro ao atualizar lead.')
      setSnackbarOpen(true)
    }
  }

  const updateColumnName = async (columnId, newName) => {
    try {
      await columnService.updateColumnPatch(columnId, { name: newName })

      setStatuses(prevStatuses =>
        prevStatuses.map(status =>
          status.id === columnId ? { ...status, name: newName } : status,
        ),
      )

      setSnackbarMessage('Nome da coluna atualizado com sucesso!')
      setSnackbarOpen(true)

      await reloadBoardDetails()
    } catch (error) {
      console.error('Erro ao atualizar o nome da coluna:', error)
      setSnackbarMessage('Erro ao atualizar o nome da coluna.')
      setSnackbarOpen(true)
    }
  }

  return {
    addLead,
    boards,
    selectedBoard,
    setSelectedBoard,
    loading,
    error,
    leads,
    statuses,
    columns,
    setColumns,
    setLeads,
    snackbarMessage,
    snackbarOpen,
    handleSnackbarClose,
    updateLeadColumn,
    handleDeleteLead,
    handleUpdateLead,
    updateColumnName,
    fetchBoardDetails,
  }
}

export default useKanban
