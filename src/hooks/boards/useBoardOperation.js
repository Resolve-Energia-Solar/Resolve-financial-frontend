import boardOperationService from "@/services/boardOperationService"
import userService from "@/services/userService"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';

export default function boardOperation() {

    const [boards, setBoards] = useState()
    const [board, setBoard] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cardSelected, setCardSelected] = useState()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [data, setData] = useState()
    const [dataProject, setDataProject] = useState()
    const [contentType, setContentType] = useState()
    const [text, setText] = useState()
    const [comments, setComments] = useState()
    const [openModalMessage, setOpenModalMessage] = useState(false)
    const [message, setMessage] = useState({})
    const [viewMode, setViewMode] = useState('kanban')
    const [tasks, setTasks] = useState()

    const handleCardClick = async (item) => {
        setIsModalOpen(true)
        setCardSelected(item)
        fetchComments(item.project.id)
        console.log('comentarios item', item)

        const userData = await userService.getUserById(item?.project?.sale?.customer);


        setDataProject(
            {
                ...item?.project, sale:
                {
                    ...item?.project.sale, customer:
                        { ...item?.project.sale.customer, ...userData }
                }
            }
        )
    }
    const handleModalClosed = () => {
        setIsModalOpen(false)
        setCardSelected(null)
        setComments(null)
    }

    const onClickViewMode = () => {

        if (viewMode === 'kanban') {
            setViewMode('list')
        } else {
            setViewMode('kanban')
        }
    }

    useEffect(() => {
        async function fetchData() {
            const boardsResponse = await boardOperationService.index({ fields: 'id,title,is_lead' })
            const BoardsFilter = boardsResponse.results.filter((board) => {
                return board.is_lead == false
            })

            setBoards(BoardsFilter)

            console.log(BoardsFilter)

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
        const tasks = boardResponse?.columns.flatMap((column) => column.task) || [];
        setBoard(boardResponse)
        setTasks(tasks);

    }

    const handleChangeBoard = (e) => {
        const { value } = e.target
        fetchDataBoard(value)
        localStorage.setItem('lastedBoard', value)
    }

    const handleSearch = async (e) => {

    }

    const handleDrawerOpen = (e) => {
        setIsDrawerOpen(!isDrawerOpen)
    }
    const handleDrawerClose = () => {
        setIsDrawerOpen(!isDrawerOpen)
    }

    useEffect(() => {
        if (!cardSelected?.id_integration) {
            console.log(' tem id_integration', cardSelected)
            setContentType(cardSelected?.content_type?.model ? cardSelected?.content_type.model : cardSelected?.content_type)

            if (cardSelected?.content_type == 42 || cardSelected?.content_type?.model == 'project') {

            }

        } else {
            console.log('Não tem id_integration', cardSelected)
            setContentType(cardSelected?.content_type?.name ? cardSelected?.content_type.name : cardSelected?.content_type)
        }

    }, [cardSelected])
    const handleText = async (text) => {

        const token = Cookies.get('access_token');

        try {
            const response = await fetch('https://crm.resolvenergiasolar.com/api/comments/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify(
                    {
                        "author_id": 2,
                        "content_type_id": 42,
                        "object_id": cardSelected?.project?.id,
                        "text": text
                    }
                )
            }) 
            const data = await response.json()

            if (response.ok) {
                setText()
                fetchComments(cardSelected?.project?.id)
                setMessage({ title: 'Salvo com Sucesso', message: 'O comentário foi salvo com sucesso!', type: true })
                setOpenModalMessage(true)
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ title: 'Erro ao Salvar', message: 'O comentário não foi salvo com sucesso!', type: true })
            setOpenModalMessage(true)
        }
    }

    async function fetchComments(object_id) {
        const token = Cookies.get('access_token');
        try {
            const response = await fetch(`https://crm.resolvenergiasolar.com/api/comments/?object_id=${object_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'GET',

            })

            const data = await response.json()
            if (response.ok) {
                setComments(data.results)
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return {
        boards,
        setBoard,
        board,
        handleSearch,
        handleChangeBoard,
        handleModalClosed,
        handleCardClick,
        isModalOpen,
        cardSelected,
        isDrawerOpen,
        handleDrawerOpen,
        handleDrawerClose,
        data,
        contentType,
        dataProject,
        setText,
        comments,
        handleText,
        text,
        setOpenModalMessage,
        openModalMessage,
        message,
        viewMode,
        onClickViewMode,
        tasks
    }

}