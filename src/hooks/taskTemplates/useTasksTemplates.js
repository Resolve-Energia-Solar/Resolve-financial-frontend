import taskTemplateService from "@/services/taskTemplateService";
import { useEffect, useState } from "react";

export default function tasksTemplates() {

    const [data, setData] = useState()

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const response = await taskTemplateService.index();
        setData(response.results);
    }

    return {
        tasksTemplates: data
    }
}