import boardOperationService from "@/services/boardOperationService"
import userService from "@/services/userService"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import taskTemplateService from "@/services/taskTemplateService";
import taskService from "@/services/taskService";

export default function boardOperation() {

    const documentStatus = [
        { label: 'Pendente', value: 1, bgcolor: '#ff0000' },
        { label: 'Em andamento', value: 2, bgcolor: '#00ff00' },
        { label: 'Concluído', value: 3, bgcolor: '#c7e3b1' }
    ]

    const designerStatus = [
        { label: 'Revisión', value: 1 },
        { label: 'Diseño', value: 2 },
        { label: 'Desarrollo', value: 3 }
    ]

    const financierStatus = [
        { label: 'Revisión', value: 1 },
        { label: 'Diseño', value: 2 },
        { label: 'Desarrollo', value: 3 }
    ]

    const requestStatus = [
        { label: 'Pendiente', value: 1 },
        { label: 'En Progreso', value: 2 },
        { label: 'En Revisión', value: 3 },
        { label: 'Cerrado', value: 4 }
    ]

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
    const [componentName, setComponentName] = useState()
    const [optionsFooter, setOptionsFooter] = useState()
    const [textFooter, setTextFooter] = useState()
    const [openNewTask, setOpenNewTask] = useState()
    const [tasksTemplate, setTasksTemplate] = useState()
    const [taskTemplateSelected, setTaskTemplateSelected] = useState([])

    const handleCardClick = async (item) => {
        setIsModalOpen(true)
        setCardSelected(item)
        fetchComments(item.project.id)
        fetchTasksTemplate()
        const userData = await userService.getUserById(item?.project?.sale?.customer);
        const taskTemplateData = await taskTemplateService.find(item.task_template);
        setComponentName(taskTemplateData.component)
        FooterDefiner(taskTemplateData.component)


        setCardSelected({ ...item, task_template: { ...taskTemplateData } })
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

    const fetchTasksTemplate = async () => {
        try {
            const response = await taskTemplateService.index()
            console.log('oasdasdasdi1', response)

            const tasksTemplateResult = response.results.filter((item) => {
                return item.auto_create == false
            }
            )
            console.log('oasdasdasdi', tasksTemplateResult)

            setTasksTemplate(tasksTemplateResult)
        } catch (error) {
            console.log('Error: ', error)
        }


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
        setBoard(boardResponse);
        setTasks(tasks);
    }

    const handleChangeBoard = (e) => {
        const { value } = e.target
        fetchDataBoard(value)
        localStorage.setItem('lastedBoard', value)
    }

    const handleSearch = async (e) => {

    }

    const handleDrawerOpen = () => {

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

    function FooterDefiner(componentName) {

        console.log('oioioi ', componentName)
        if (componentName == 'project') {
            setOptionsFooter(designerStatus);
            setTextFooter('Status do Projeto');
        } else if (componentName == 'Contract') {
            setOptionsFooter(documentStatus);
            setTextFooter('Status da Documentação');

        } else if (componentName == 'requestEnergyCompany') {
            setOptionsFooter(requestStatus);
            setTextFooter('Status da Solicitação da C.');

        } else if (componentName == 'Financier') {
            setOptionsFooter(financierStatus);
            setTextFooter('Status do Financeiro');
        }
    }


    const onClickFooter = async (value) => {


        const Done = board.columns.filter(board => board.column_type == 'D');
        const inProgress = board.columns.filter(board => board.column_type == 'I');

        const IdColumnDone = Done[0].id
        const IdColumnInProgress = inProgress[0].id

        if (value == 'done') {
            try {
                const response = await taskService.update(cardSelected?.id, {
                    column_id: IdColumnDone
                })



                fetchDataBoard(board.id)
                setMessage({ title: 'Alterado com Sucesso', message: 'O status foi alterado com sucesso!', type: true })
                setOpenModalMessage(true)

            } catch (err) {
                console.error('Error:', err);
                setMessage({ title: 'Erro ao Alterar Status', message: 'O status não foi alterado com sucesso!', type: false })
            }
        }

        if (value == 'inProgress') {
            try {
                const response = taskService.update(cardSelected?.id, {
                    column_id: IdColumnInProgress
                })

                if (response.ok) {
                    fetchDataBoard(board.id)
                    setMessage({ title: 'Alterado com Sucesso', message: 'O status foi alterado com sucesso!', type: true })
                    setOpenModalMessage(true)
                }

            } catch (err) {
                console.error('Error:', err);
                setMessage({ title: 'Erro ao Alterar Status', message: 'O status não foi alterado com sucesso!', type: false })
            }
        }

        if (value == 'prevented') {
            setOpenNewTask(true)
        }
    }





    const saveNewTask = async (item) => {

        console.log('oasdasdasdi', item)


        try {
            const response = await taskService.create({
                column_id: item.column,
                title: item.title,
                due_date: new Date(),

            })
            if (response) {
                setOpenNewTask(false)
                fetchDataBoard(board.id)
                setMessage({ title: 'Salvo com Sucesso', message: 'A tarefa foi salva com sucesso!', type: true })
                setOpenModalMessage(true)
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage({ title: 'Erro ao Salvar', message: 'A tarefa não foi salva com sucesso!', type: false })
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
        tasks,
        optionsFooter,
        componentName,
        textFooter,
        setTextFooter,
        setTasks,
        setComponentName,
        FooterDefiner,
        onClickFooter,
        tasksTemplate,
        openNewTask,
        setOpenNewTask,
        saveNewTask,
    }

}