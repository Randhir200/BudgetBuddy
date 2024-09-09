import { Button } from "@mui/material";
import React from "react";

interface ButtonCompProps {
    title: String,
    variant: "text" | "contained" | "outlined",
    color: "primary" | "secondary" | "success" | "error",
    size: "small" | "medium" | "large",
    event: ()=>void
}

const ButtonComp: React.FC<ButtonCompProps> = ({ title,variant = "contained", color = "primary", size = "small", event }) => {
    return (
        <>
            <Button variant={variant} color={color} size={size} onClick={event}>
                {title}
            </Button>
        </>
    )
}

export default ButtonComp;