import React, { useState } from "react";
import "./TruthTableGenerator.css"; // Путь к вашему CSS-файлу

const TruthTableGenerator = () => {
  const [logicalFunction, setLogicalFunction] = useState("");
  const [truthTable, setTruthTable] = useState([]);
  const [sopExpression, setSOPExpression] = useState("");
  const [posExpression, setPOSExpression] = useState("");

  const [zhegalkinPolynomial, setZhegalkinPolynomial] = useState("");

  const generateZhegalkinPolynomial = () => {
    const variables = getVariables(logicalFunction);
    const coefficients = [];

    for (let i = 0; i < Math.pow(2, variables.length); i++) {
      const result = calculateBooleanFunction(
        logicalFunction,
        getRowValues(i, variables.length)
      );
      coefficients.push(result);
    }

    const zhegalkinPolynomialTerms = [];

    for (let i = 0; i < coefficients.length; i++) {
      if (coefficients[i] === 1) {
        const binaryRepresentation = i
          .toString(2)
          .padStart(variables.length, "0");
        const term = binaryRepresentation
          .split("")
          .map((bit, index) =>
            bit === "0" ? `!${variables[index]}` : variables[index]
          )
          .join(" && ");
        zhegalkinPolynomialTerms.push(`(${term})`);
      }
    }

    const zhegalkinExpression = zhegalkinPolynomialTerms.join(" ⊕ ");
    setZhegalkinPolynomial(zhegalkinExpression);
  };

  const generateSOP = () => {
    const minterms = getMinterms(logicalFunction);
    const sop = calculateSOP(minterms);
    setSOPExpression(sop);
  };

  const generatePOS = () => {
    const maxterms = getMaxterms(logicalFunction);
    const pos = calculatePOS(maxterms);
    setPOSExpression(pos);
  };
  const getMaxterms = (logicalFunction) => {
    const maxterms = [];
    for (
      let i = 0;
      i < Math.pow(2, getVariables(logicalFunction).length);
      i++
    ) {
      const result = calculateBooleanFunction(
        logicalFunction,
        getRowValues(i, getVariables(logicalFunction).length)
      );
      if (result === 0) {
        maxterms.push(i);
      }
    }
    return maxterms;
  };
  const calculatePOS = (maxterms) => {
    if (maxterms.length === 0) {
      return "0"; // If there are no maxterms, POS is 0
    }

    const variables = getVariables(logicalFunction);
    const posTerms = maxterms.map((maxterm) => {
      const binaryRepresentation = maxterm
        .toString(2)
        .padStart(variables.length, "0");
      const term = binaryRepresentation
        .split("")
        .map((bit, index) =>
          bit === "0" ? variables[index] : `!${variables[index]}`
        )
        .join(" || ");
      return `(${term})`;
    });

    return posTerms.join(" && ");
  };
  const getMinterms = (logicalFunction) => {
    const minterms = [];
    for (
      let i = 0;
      i < Math.pow(2, getVariables(logicalFunction).length);
      i++
    ) {
      const result = calculateBooleanFunction(
        logicalFunction,
        getRowValues(i, getVariables(logicalFunction).length)
      );
      if (result === 1) {
        minterms.push(i);
      }
    }
    return minterms;
  };
  const calculateSOP = (minterms) => {
    if (minterms.length === 0) {
      return "1"; // If there are no minterms, SOP is 1
    }

    const variables = getVariables(logicalFunction);
    const sopTerms = minterms.map((minterm) => {
      const binaryRepresentation = minterm
        .toString(2)
        .padStart(variables.length, "0");
      const term = binaryRepresentation
        .split("")
        .map((bit, index) =>
          bit === "1" ? variables[index] : `!${variables[index]}`
        )
        .join(" && ");
      return `(${term})`;
    });

    return sopTerms.join(" || ");
  };
  const handleButtonClick = (value) => {
    setLogicalFunction(logicalFunction + value);
  };
  const handleInputChange = (e) => {
    setLogicalFunction(e.target.value);
  };

  const handleClearFunction = () => {
    setLogicalFunction("");
    setTruthTable([]);
  };

  const handleAddParenthesis = (type) => {
    setLogicalFunction(logicalFunction + (type === "open" ? "(" : ")"));
  };

  const generateTruthTable = () => {
    const variables = getVariables(logicalFunction);
    const negatedVariables = getNegatedVariables(logicalFunction);
    const expressionsInParentheses =
      getExpressionsInParentheses(logicalFunction);

    const tableHeader = (
      <tr key="header">
        {variables.map((variable) => (
          <th key={variable}>{variable}</th>
        ))}
        {negatedVariables.map((negatedVar) => (
          <th key={`negated_${negatedVar}`}>{`¬${negatedVar}`}</th>
        ))}
        {expressionsInParentheses.map((expression, index) => (
          <th key={`expression_${index}`}>{`(${expression})`}</th>
        ))}
        <th key="result">Результат</th>
      </tr>
    );

    const tableBody = [];

    for (let i = 0; i < Math.pow(2, variables.length); i++) {
      const rowValues = getRowValues(i, variables.length);
      const negatedValues = negatedVariables.map((negatedVar) =>
        rowValues[variables.indexOf(negatedVar)] ? 0 : 1
      );
      const rowResults = expressionsInParentheses.map((expression) =>
        calculateBooleanFunction(expression, rowValues)
      );
      const finalResult = calculateBooleanFunction(logicalFunction, rowValues);
      const tableRow = (
        <tr key={i}>
          {rowValues.map((value, index) => (
            <td key={index}>{value}</td>
          ))}
          {negatedValues.map((value, index) => (
            <td key={`negated_${index}`}>{value}</td>
          ))}
          {rowResults.map((result, index) => (
            <td key={`result_${index}`}>{result}</td>
          ))}
          <td key="finalResult">{finalResult}</td>
        </tr>
      );
      tableBody.push(tableRow);
    }

    setTruthTable([tableHeader, ...tableBody]);
  };

  const getNegatedVariables = (logicalFunction) => {
    const negatedVariables = [];

    logicalFunction.split("").forEach((char, index) => {
      if (char === "!" && index + 1 < logicalFunction.length) {
        const nextChar = logicalFunction[index + 1];
        if (nextChar.match(/[a-z]/i)) {
          negatedVariables.push(nextChar.toUpperCase());
        }
      }
    });

    return negatedVariables;
  };

  const getVariables = (logicalFunction) => {
    const variableSet = new Set();

    logicalFunction.split("").forEach((char) => {
      if (char.match(/[a-z]/i)) {
        variableSet.add(char.toUpperCase()); // Преобразуем в заглавные буквы
      }
    });

    return Array.from(variableSet);
  };

  const getExpressionsInParentheses = (logicalFunction) => {
    const expressions = [];
    let currentExpression = "";

    for (let i = 0; i < logicalFunction.length; i++) {
      const char = logicalFunction[i];

      if (char === "(") {
        currentExpression = "";
      } else if (char === ")") {
        if (currentExpression.trim() !== "") {
          expressions.push(currentExpression.trim());
        }
      } else {
        currentExpression += char;
      }
    }

    return expressions;
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

    // Используйте eval для вычисления логического выражения
    return eval(expression) ? 1 : 0;
  };

  return (
    <div>
      <h2>Truth Table Generator</h2>
      <p>
        <button onClick={() => handleButtonClick("A")}>A</button>
        <button onClick={() => handleButtonClick("B")}>B</button>
        <button onClick={() => handleButtonClick("C")}>C</button>
        <button onClick={() => handleButtonClick("X")}>X</button>
        <button onClick={() => handleButtonClick("Y")}>Y</button>
        <button onClick={() => handleButtonClick(" && ")}>И</button>
        <button onClick={() => handleButtonClick(" || ")}>ИЛИ</button>
        <button onClick={() => handleButtonClick("!")}>НЕ</button>
        <button onClick={() => handleAddParenthesis("open")}>(</button>
        <button onClick={() => handleAddParenthesis("close")}>)</button>
      </p>
      <input type="text" value={logicalFunction} onChange={handleInputChange} />
      <button
        onClick={() => {
          generateTruthTable();
          generateSOP();
          generatePOS();
          generateZhegalkinPolynomial();
        }}
      >
        Генерировать таблицу
      </button>
      <button onClick={handleClearFunction}>Очистить функцию</button>
      <table>
        <tbody>{truthTable}</tbody>
      </table>
      {sopExpression && (
        <div>
          <h3>СДНФ:</h3>
          <p>{sopExpression}</p>
        </div>
      )}
      {posExpression && (
        <div>
          <h3>СКНФ:</h3>
          <p>{posExpression}</p>
        </div>
      )}

      {zhegalkinPolynomial && (
        <div>
          <h3>Полином Жегалкина:</h3>
          <p>{zhegalkinPolynomial}</p>
        </div>
      )}
    </div>
  );
};

export default TruthTableGenerator;
