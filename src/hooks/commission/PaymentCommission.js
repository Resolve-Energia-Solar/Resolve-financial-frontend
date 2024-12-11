import { useState } from "react";

export default function PaymentCommission() {


    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetails] = useState(false);
    const [formData, setFormData] = useState();
    const [isEditing, setIsEditing] = useState(true);
    const [row, setRow] = useState();
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const toggleDrawerDetails = (newOpen) => () => {
        setOpenDetails(newOpen);
        setRow(null);
    };

    const handleClickRow = (item) => {
        setRow(item.id)
        setFormData(item)
        setOpenDetails(true)
    }

    const handleInputChange = (e) => {

        console.log(e)
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    


    return {
        toggleDrawerDetails,
        handleInputChange,
        handleClickRow,
        setIsEditing,
        toggleDrawer,
        openDetail,
        isEditing,
        formData,
        open,
        row
    }
}