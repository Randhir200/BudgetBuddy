import { Button, CircularProgress } from "@mui/material";
import React from "react";

interface ButtonCompProps {
    title: String,
    variant: "text" | "contained" | "outlined",
    color: "primary" | "secondary" | "success" | "error",
    size: "small" | "medium" | "large",
    event: () => void,
    loading?: boolean //optional
}

const ButtonComp: React.FC<ButtonCompProps> = ({ title, variant = "contained",
    color = "primary",
    size = "small",
    event,
    loading = false }) => {
    console.log('Btn: re-renders');
    return (
        <>
            <Button variant={variant} color={color} size={size} onClick={event}>
                {loading ? <CircularProgress sx={{color:"white"}} size="1.5rem" /> : title}
            </Button>
        </>
    )
}

export default ButtonComp;