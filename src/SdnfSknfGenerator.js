import React, { useState } from "react";

const SdnfSknfGenerator = ({ logicalFunction }) => {
  const [sdnf, setSdnf] = useState("");
  const [sknf, setSknf] = useState("");

  const generateSdnfAndSknf = () => {
    const variables = getVariables(logicalFunction);
    const truthTable = generateTruthTable(variables, logicalFunction);

    const sdnfTerms = generateSdnfTerms(truthTable, variables);
    const sknfTerms = generateSknfTerms(truthTable, variables);

    setSdnf(sdnfTerms.join(" + "));
    setSknf(sknfTerms.join(" * "));
  };

  const getVariables = (logicalFunction) => {
    const variableSet = new Set();

    logicalFunction.split("").forEach((char) => {
      if (char.match(/[a-z]/i)) {
        variableSet.add(char.toUpperCase());
      }
    });

    return Array.from(variableSet);
  };

  const generateTruthTable = (variables, logicalFunction) => {
    const table = [];
    for (let i = 0; i < Math.pow(2, variables.length); i++) {
      const rowValues = getRowValues(i, variables.length);
      const finalResult = calculateBooleanFunction(logicalFunction, rowValues);
      table.push({ rowValues, finalResult });
    }
    return table;
  };

  const getRowValues = (index, numVariables) => {
    return Array.from({ length: numVariables }, (_, i) =>
      Boolean((index >> (numVariables - i - 1)) & 1) ? 1 : 0
    );
  };

  const calculateBooleanFunction = (logicalFunction, values) => {
    const expression = logicalFunction.replace(
      /[a-z]/gi,
      (match) =>
        values[getVariables(logicalFunction).indexOf(match.toUpperCase())]
    );
    return new Function(`return ${expression}`)();
  };

  const generateSdnfTerms = (truthTable, variables) => {
    return truthTable
      .filter((row) => row.finalResult === 1)
      .map((row) => {
        const terms = row.rowValues.map((value, index) =>
          value === 1 ? variables[index] : `!${variables[index]}`
        );
        return `(${terms.join(" && ")})`;
      });
  };

  const generateSknfTerms = (truthTable, variables) => {
    return truthTable
      .filter((row) => row.finalResult === 0)
      .map((row) => {
        const terms = row.rowValues.map((value, index) =>
          value === 0 ? variables[index] : `!${variables[index]}`
        );
        return `(${terms.join(" || ")})`;
      });
  };

  return (
    <div>
      <h2>СДНФ и СКНФ Генератор</h2>
      <button onClick={generateSdnfAndSknf}>Генерировать СДНФ и СКНФ</button>

      <div>
        <strong>СДНФ:</strong> {sdnf}
      </div>
      <div>
        <strong>СКНФ:</strong> {sknf}
      </div>
    </div>
  );
};

export default SdnfSknfGenerator;
