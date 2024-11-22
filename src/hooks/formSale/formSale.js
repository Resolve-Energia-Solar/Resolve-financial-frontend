

const [projects, setProjects] = useState([])
const [payments, setPayments] = useState([])
const [total, setTotal] = useState(0)
const [additional, setAdditional] = useState(0)
const [adjustment, setAdjustment] = useState(0)


// Funções para Projetos
const addProject = (newProject) => {
    setProjects([...projects, { ...newProject, id: Date.now() }])
}

const updateProject = (updatedProject) => {
    setProjects(projects.map(proj => proj.id === updatedProject.id ? updatedProject : proj))
}

const removeProject = (id) => {
    setProjects(projects.filter(proj => proj.id !== id))
}

// Funções para Pagamentos
const addPayment = (newPayment) => {
    setPayments([...payments, { ...newPayment, id: Date.now() }])
}

const updatePayment = (updatedPayment) => {
    setPayments(payments.map(pay => pay.id === updatedPayment.id ? updatedPayment : pay))
}

const removePayment = (id) => {
    setPayments(payments.filter(pay => pay.id !== id))
}

return { addProject, updateProject, removeProject, addPayment, updatePayment, removePayment }