import React, { useState } from "react";
import styled from "styled-components";
import ButtonComp from "../components/ButtonComp";
import {useTheme, useMediaQuery} from "@mui/material";
import { ConfigForm } from "../components/ConfigForm";
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: black;
`;

const ButtonBox= styled.div`
  display:flex;
  justify-content: end;
  gap: 5px;
`;
// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 0.1em;
`;

const Config: React.FC = () => {
  const [toggleTypeBtn, setToggleTypeBtn] = useState(false);
  const [toggleCatBtn, setToggleCatBtn] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  function handleToggleTypeBtn (){
    setToggleTypeBtn(!toggleTypeBtn)
  } 
  
  function handleToggleCatBtn (){
    setToggleCatBtn(!toggleCatBtn)
  }

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
         <ButtonComp
          title="Add Type"
          variant="contained"
          color="primary"
          size={isSmallScreen ? "small" : "medium"} // Adjust button size
          event={handleToggleCatBtn}
        />   
         </ButtonBox>
         <div>
          {
            toggleTypeBtn &&
            <ConfigForm CateForm ={false}
              isSmallScreen = {isSmallScreen}
              theme = {theme}
              handleAddType = {()=>{}}
              formData = {[]}
              handleSubmit = {()=>{}} />
          }
          {
            toggleCatBtn &&
            <ConfigForm 
            CateForm ={true}
            isSmallScreen = {isSmallScreen}
            theme = {theme}
            handleAddType = {()=>{}}
            formData = {[]}
            handleSubmit = {()=>{}} 
             />
          }
         </div>
      </Wrapper>
    </>
  );
};

export default Config;
