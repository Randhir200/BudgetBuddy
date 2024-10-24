import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/Common/ButtonComp";
import { useTheme, useMediaQuery, Typography, Box } from "@mui/material";
import { ExpenseTypeForm } from "../components/ExpenseType/ExpenseTypeForm";
import ExpenseTypeTable from "../components/ExpenseType/ExpenseTypeTable";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../ReduxToolkit/store";
import { useSnackbar } from 'notistack';
import { clearAlert } from "../ReduxToolkit/slices/alertSlice";

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 10px;
`;

const ExpenseType: React.FC = () => {
  const [toggleTypeBtn, setToggleTypeBtn] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { message, variant } = useSelector((state: RootState) => state.alertReducer);
  const { addStatus } = useSelector((state: RootState) => state.expenseTypeReducer);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch: AppDispatch = useDispatch();

  function handleToggleTypeBtn() {
    setToggleTypeBtn(!toggleTypeBtn)
  }

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message, { variant })
      dispatch(clearAlert());
    }
  }, [message, variant, dispatch]);

  useEffect(() => {
    //close form if data is upload otherwise wait.
    if (addStatus === 'success') {
      setToggleTypeBtn(false);
    }
  }, [addStatus])

  return (
    <>
      <Wrapper>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            gutterBottom
            sx={{ textAlign: "left", fontSize: isSmallScreen ? "1.2rem" : "1.5rem" }} // Smaller font for small screens
          >
            Config
          </Typography>
          <ButtonComp
            title="Add Type"
            variant="contained"
            color="primary"
            size={isSmallScreen ? "small" : "medium"} // Adjust button size
            event={handleToggleTypeBtn}
          />
        </Box>
        <div>
          {
            toggleTypeBtn &&
            <ExpenseTypeForm
              isSmallScreen={isSmallScreen}
              theme={theme}
            />
          }

        </div>
        <ExpenseTypeTable />
      </Wrapper>
    </>
  );
};

export default ExpenseType;