import { useState, useEffect } from 'react'
import RoofTypeService from '@/services/RoofTypeService'

const useRoofTypes = (initialOrdering = '') => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roofTypes, setRoofTypes] = useState([])
  const [ordering, setOrdering] = useState(initialOrdering)

  const fetchRoofTypes = async () => {
    try {
      setLoading(true)
      const data = await RoofTypeService.getRoofTypes(ordering)
      setRoofTypes(data.results)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar os tipos de telhas')
      console.error('Erro ao buscar tipos de telhas:', err)
    } finally {
      setLoading(false)
    }
  }

  const addRoofType = async (newRoofType) => {
    try {
      setLoading(true)
      const created = await RoofTypeService.createRoofType(newRoofType)
      setRoofTypes(prevTypes => [...prevTypes, created])
      return created
    } catch (err) {
      setError('Erro ao adicionar tipo de telha')
      console.error('Erro ao criar tipo de telha:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRoofType = async (id, updatedData) => {
    try {
      setLoading(true)
      const updated = await RoofTypeService.updateRoofType(id, updatedData)
      setRoofTypes(prevTypes => 
        prevTypes.map(type => type.id === id ? updated : type)
      )
      return updated
    } catch (err) {
      setError('Erro ao atualizar tipo de telha')
      console.error('Erro ao atualizar tipo de telha:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRoofType = async (id) => {
    try {
      setLoading(true)
      await RoofTypeService.deleteRoofType(id)
      setRoofTypes(prevTypes => prevTypes.filter(type => type.id !== id))
    } catch (err) {
      setError('Erro ao deletar tipo de telha')
      console.error('Erro ao deletar tipo de telha:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changeOrdering = (newOrdering) => {
    setOrdering(newOrdering)
  }

  const searchByName = async (name) => {
    try {
      setLoading(true)
      const data = await RoofTypeService.getRoofTypeByName(name)
      setRoofTypes(data.results)
      setError(null)
    } catch (err) {
      setError('Erro ao buscar tipos de telha')
      console.error('Erro ao buscar tipos de telha:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoofTypes()
  }, [ordering])

  return {
    loading,
    error,
    roofTypes,
    addRoofType,
    updateRoofType,
    deleteRoofType,
    changeOrdering,
    searchByName,
    refreshRoofTypes: fetchRoofTypes
  }
}

export default useRoofTypes