import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/Common/ButtonComp";
import { useTheme, useMediaQuery, Typography, Box } from "@mui/material";
import { ExpenseTypeForm } from "../components/ExpenseType/ExpenseTypeForm";
import axios, { AxiosError } from "axios";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";
import { AlertComp } from "../components/Common/AlertComp";
import { budgetBuddyApiUrl } from "../config/config";
import ExpenseTypeTable from "../components/ExpenseType/ExpenseTypeTable";
import { UseDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../ReduxToolkit/store";

//getting userId from local storage
const userId = localStorage.getItem('userId');

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 10px;
`;


interface State extends SnackbarOrigin {
  open: boolean;
}

interface alertState extends AlertProps {
  message: string
}

const formInitialState = {
  type: '',
  categories: [],
  userId: userId
}

const ExpenseType: React.FC = () => {
  const [toggleTypeBtn, setToggleTypeBtn] = useState(false);
  const [formData, setFormData] = useState(formInitialState);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // const [expenseTypes, setExpenseTypes] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [toastState, setToastState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = toastState;
  const [alertState, setAlertState] = React.useState<alertState>({ severity: "success", message: '' });

  function handleToggleTypeBtn() {
    setToggleTypeBtn(!toggleTypeBtn)
  }

  // async function fetchExpenseTypes() {
  //   try {
  //     const response = await axios(`${budgetBuddyApiUrl}/config/getAllConfigs?userId=${userId}`);
  //     const data = response.data;
  //     setExpenseTypes(data.data);
  //     setLoading(false);
  //     setAlertState({ ...alertState, severity: data.status, message: data.message })
  //   } catch (error: any) {
  //     if (AxiosError) {
  //       setAlertState({ ...alertState, severity: 'error', message: error })
  //     }
  //     setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

  //   } finally {
  //     setToastState({ ...toastState, open: true });
  //     setTimeout(() => {
  //       setToastState({ ...toastState, open: false });
  //     }, 2000); // Close after 2 seconds
  //   }
  // }

  // async function addExpenseType() {
  //   try {
  //     const response = await axios.post(`${budgetBuddyApiUrl}/config/addConfig`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer token'
  //         }
  //       }
  //     );

  //     const data = response.data;
  //     setAlertState({
  //       ...alertState,
  //       severity: data.status,
  //       message: data.message
  //     });

  //     setFormData(formInitialState);

  //     // fetch again updated expenses with 1000ms delay
  //     setTimeout(() => { fetchExpenseTypes() }, 1000);


  //   } catch (error: any) {
  //     setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

  //   } finally {
  //     setToastState({ ...toastState, open: true });
  //     setTimeout(() => {
  //       setToastState({ ...toastState, open: false });
  //     }, 2000); // Close after 2 seconds
  //   }

  // }


  // useEffect(() => {
  //   fetchExpenseTypes();
  // }, []);

  return (
    <>
      <Wrapper>
        <AlertComp vertical={vertical} horizontal={horizontal} open={open}
          alertState={alertState}
        />

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
            <ExpenseTypeForm CateForm={false}
              isSmallScreen={isSmallScreen}
              theme={theme}
              handleAddType={() => { }}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={() => { }}
            />

          }

        </div>
        <ExpenseTypeTable />
      </Wrapper>
    </>
  );
};

export default ExpenseType;