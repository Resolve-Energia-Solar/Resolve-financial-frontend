import boardOperationService from "@/services/boardOperationService"
import { set } from "lodash"
import { useEffect, useState } from "react"

export default function boardOperation() {

    const [boards, setBoards] = useState()
    const [board, setBoard] = useState()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cardSelected, setCardSelected] = useState()
    const handleCardClick = (item) => {
        setIsModalOpen(true)
        setCardSelected(item)
    }

    const handleModalClosed = () => {
        setIsModalOpen(false)
    }


    useEffect(() => {

        async function fetchData() {
            const boardsResponse = await boardOperationService.index()

            const BoardsFilter = boardsResponse.results.filter((board) => {
                return board.is_lead == false
            })

            setBoards(BoardsFilter)
            if (!board && BoardsFilter[0].id) {
                const lastB = localStorage.getItem('lastedBoard')
                if (lastB) {
                    await fetchDataBoard(lastB)
                } else {
                    await fetchDataBoard(BoardsFilter[0].id)
                }
            }
        }
        fetchData()
    }, [])

    const fetchDataBoard = async (id) => {
        const boardResponse = await boardOperationService.find(id)

        setBoard(boardResponse)
    }

    const handleChangeBoard = (e) => {
        const { value } = e.target
        fetchDataBoard(value)
        localStorage.setItem('lastedBoard', value)
    }

    const handleSearch = async (e) => {

        const { value } = e.target

        console.log(board)
        const matchedTasks = board.columns.flatMap(column =>
            column.task.filter(task => task.title.toLowerCase().includes(value))
        );

        setBoard(matchedTasks)

    }


    return { boards, setBoard, board, handleSearch, handleChangeBoard, handleModalClosed, handleCardClick, isModalOpen, cardSelected }

}