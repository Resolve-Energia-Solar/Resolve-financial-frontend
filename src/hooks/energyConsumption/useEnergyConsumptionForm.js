import ProposalService from "@/services/proposalService";
import { useEffect, useState } from "react";
import proposalService from '@/services/proposalService';
import { useSelector } from "react-redux"

const useEnergyConsumptionForm = (initialData, id) => {
    const user = useSelector((state) => state.user?.user);

    const [formData, setFormData] = useState({
        project: null,
        medium_consumption: "",
        appliances_kwh_sum: "",
        uploaded_file: null,

    });

    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                project: initialData.project?.id || null,
                medium_consumption: initialData.medium_consumption || null,
                appliances_kwh_sum: initialData.appliances_kwh_sum || null,
                uploaded_file: initialData.uploaded_file || null,

            })
        }
    }, [initialData, user?.id]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        const dataToSend = {
            project: formData.project,
            medium_consumption: formData.medium_consumption,
            appliances_kwh_sum: formData.appliances_kwh_sum,
            uploaded_file: formData.uploaded_file,
        };

        try {
            if (id) {
                await proposalService.update(id, dataToSend);
            } else {
                await proposalService.create(dataToSend);
            }
            setFormErrors({});
            setSuccess(true);
            return true;
        } catch (err) {
            setSuccess(false);
            setFormErrors(err.response?.data || {});
            console.error(err.response?.data || err);
            return false;
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            setFormErrors('Tamanho máximo do arquivo não deve ser acima de 10 MB');
            
        } else {
            setFormData({uploaded_file: file});
        }
    };

    return {
        formData,
        setFormData,
        handleSave,
        handleChange,
        handleFileChange,
        formErrors,
        success,
        loading,
    };
};

export default useEnergyConsumptionForm;