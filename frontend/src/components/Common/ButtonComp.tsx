import { Button, CircularProgress } from "@mui/material";
import React from "react";

interface ButtonCompProps {
    title: String,
    variant: "text" | "contained" | "outlined",
    color: "primary" | "secondary" | "success" | "error",
    size: "small" | "medium" | "large",
    // event: (arg1:string, e:React.MouseEvent<HTMLButtonElement>)=>void,
    loading?: boolean //optional,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>, param?: any) => void;
}

const ButtonComp: React.FC<ButtonCompProps> = ({ title, variant = "contained",
    color = "primary",
    size = "small",
    onClick,
    loading = false }) => {
    return (
        <>
            <Button variant={variant} color={color} size={size} onClick={(event) => onClick?.(event)}>
                {loading ? <CircularProgress sx={{color:"white"}} size="1.5rem" /> : title}
            </Button>
        </>
    )
}

export default ButtonComp;