import React, { useState } from "react";
import TruthTableGenerator from "./TruthTableGenerator";
import SdnfSknfGenerator from "./SdnfSknfGenerator";

const App = () => {
  const [logicalFunction, setLogicalFunction] = useState("");

  const handleButtonClick = (value) => {
    setLogicalFunction(logicalFunction + value);
  };

  const handleInputChange = (e) => {
    setLogicalFunction(e.target.value);
  };

  const handleClearFunction = () => {
    setLogicalFunction("");
  };

  const handleAddParenthesis = (type) => {
    setLogicalFunction(logicalFunction + type);
  };

  return (
    <div>
      <TruthTableGenerator logicalFunction={logicalFunction} />
    </div>
  );
};

export default App;
