import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div style={{width:"99%", margin: "auto",  border:"1px solid grey"}}>
      {/* Adjust marginTop to fit below TopBar */}
      {children}
    </div>
  );
};

export default MainContent;
