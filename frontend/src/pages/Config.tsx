import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/ButtonComp";
import { useTheme, useMediaQuery } from "@mui/material";
import { ConfigForm } from "../components/ConfigForm";
import ConfigTable from "../components/ConfigTable";
import axios, {AxiosError} from "axios";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";


const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: black;
`;

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
  category: 'food',
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
      console.log(data);
      setConfigData(data.data);
      setAlertState({ ...alertState, severity: data.status, message: data.message })
    } catch (error: any) {
      if (AxiosError) {
        setAlertState({ ...alertState, severity: 'error', message: error.message })
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
        <Title>
          Config
        </Title>
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
              addType = {addType}
              handleSubmit={() => { }} />
          }

        </div>
        <ConfigTable configs={configData} />
      </Wrapper>
    </>
  );
};

export default Config;
