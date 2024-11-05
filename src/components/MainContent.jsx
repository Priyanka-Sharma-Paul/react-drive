import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Data from "./Data";
import { useAuth } from "../context/AuthContext";

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeOption, setActiveOption] = useState("My Drive");
    const [theme, setTheme] = useState("light"); 
    const [updateFiles, setUpdateFIles] = useState(0);
  
    const toggleTheme = (selectedTheme) => {
      setTheme(selectedTheme);
      document.body.className = selectedTheme; 
    };

  return (
    <>
        <Header
            setSearchTerm={setSearchTerm}
            theme={theme}
            toggleTheme={toggleTheme}
        />
        <div className={`App ${theme} flex h-screen`}>
            <Sidebar setActiveOption={setActiveOption} setUpdateFIles={setUpdateFIles}/>
            <Data searchTerm={searchTerm} activeOption={activeOption} updateFiles={updateFiles}/>
        </div>
    </>
  );
};

export default App;
