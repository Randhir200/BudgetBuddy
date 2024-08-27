import React from "react";
import {
  Box,
  Button,
} from "@mui/material";
import ExpensesForm from "../components/ExpensesForm";

const Expenses: React.FC = () => {
  // const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
   <>
   <Box>
     <Button sx={{margin:"0px 0 0", float: "right", background: "primary"}}>Add </Button>
     <ExpensesForm/>
   </Box>
   </>
  );
};

export default Expenses;
