import React from "react";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return <div style={{ padding: "16px", flexGrow: 1 }}>{children}</div>;
};

export default MainContent;
