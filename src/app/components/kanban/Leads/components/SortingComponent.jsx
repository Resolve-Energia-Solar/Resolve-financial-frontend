import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react"

const SortingFilter = ({ label, onSortChanges }) => {
    const [sortOrder, setSortOrder] = useState("asc");
    const toggleSort = () => {
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        onSortChanges(newOrder);
    };

    return (
        <Button
            onClick={toggleSort}
            sx={{
                fontSize: "12px",
                color: "#7E8388",
                backgroundColor: "transparent",
                border: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "transparent" },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" }, 
              }}
              endIcon={sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
        >
            {label}
        </Button>
    )
}

export default SortingFilter;