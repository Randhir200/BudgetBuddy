import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/ButtonComp";
import { useTheme, useMediaQuery, Typography } from "@mui/material";
import { ConfigForm } from "../components/ConfigForm";
import ConfigTable from "../components/ConfigTable";
import axios, { AxiosError } from "axios";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";
import { AlertComp } from "../components/AlertComp";


// const Title = styled.h1`
//   font-size: 1.5em;
//   text-align: center;
//   color: black;
// `;

const ButtonBox = styled.div`
  display:flex;
  justify-content: end;
  gap: 5px;
`;
// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 0.1em;
`;


interface State extends SnackbarOrigin {
  open: boolean;
}

interface alertState extends AlertProps {
  message: string
}

const formInitialState = {
  type: 'needs',
  categories: [{name:'food'}, {name:'bills'}],
  createdAt: '',
  userId: '66d89bda30bb3c771a5007c6'
}

const Config: React.FC = () => {
  const [toggleTypeBtn, setToggleTypeBtn] = useState(false);
  const [formData, setFormData] = useState(formInitialState);
  const [toggleCatBtn, setToggleCatBtn] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [configData, setConfigData] = useState([]);
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

  function handleToggleCatBtn() {
    setToggleCatBtn(!toggleCatBtn)
  }

  async function fetchConfigs() {
    try {
      const response = await axios(`http://localhost:3000/config/getAllConfigs?userId=66d89bda30bb3c771a5007c6`);
      const data = response.data;
      setConfigData(data.data);
      setAlertState({ ...alertState, severity: data.status, message: data.message })
    } catch (error: any) {
      if (AxiosError) {
        setAlertState({ ...alertState, severity: 'error', message: error })
      }
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

    } finally {
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }
  }

  async function addType() {
    try {
      const response = await axios.post('http://localhost:3000/config/addConfig',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token'
          }
        }
      );

      const data = response.data;
      setAlertState({
        ...alertState,
        severity: data.status,
        message: data.message
      });

      setFormData(formInitialState);

      // fetch again updated expenses with 1000ms delay
      setTimeout(() => { fetchConfigs() }, 1000);


    } catch (error: any) {
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.message })

    } finally {
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }

  }

  useEffect(() => {
    fetchConfigs();
  }, []);
  return (
    <>
      <Wrapper>
        <AlertComp vertical={vertical} horizontal={horizontal} open={open}
          alertState={alertState}
        />
        <Typography
          variant={isSmallScreen ? "h5" : "h4"} // Adjust the heading size based on screen size
          gutterBottom
          sx={{ textAlign: "center", fontSize: isSmallScreen ? "1.2rem" : "2rem" }} // Smaller font for small screens
        >
          Config
        </Typography>
        <ButtonBox>
          <ButtonComp
            title="Add Type"
            variant="contained"
            color="primary"
            size={isSmallScreen ? "small" : "medium"} // Adjust button size
            event={handleToggleTypeBtn}
          />
        </ButtonBox>
        <div>
          {
            toggleTypeBtn &&
            <ConfigForm CateForm={false}
              isSmallScreen={isSmallScreen}
              theme={theme}
              handleAddType={() => { }}
              formData={formData}
              addType={addType}
              setFormData={setFormData}
              handleSubmit={() => { }} />

          }

        </div>
        <ConfigTable configs={configData} />
      </Wrapper>
    </>
  );
};

export default Config;