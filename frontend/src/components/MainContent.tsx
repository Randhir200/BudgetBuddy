import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div style={{width:"99%", margin: "auto"}}>
      {/* Adjust marginTop to fit below TopBar */}
      {children}
    </div>
  );
};

export default MainContent;
