import taskService from "@/services/taskService"

export default function useTasks() {


    const newTask = () => {

        const response = taskService.createTask({
            title: "New Task",
            description: "New Task Description"
        })
    }


    return {

    }
}