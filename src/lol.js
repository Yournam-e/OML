import logo from "./logo.svg";
import "./App.css";
import TruthTableGenerator from "./TruthTableGenerator";

function App() {
  function calculateBooleanFunction(a, b) {
    return (a && b) || (!a && !b) || (!a && !b) || (a && b);
  }

  // Функция для нахождения СДНФ
  function getSDNF() {
    const sdnfTerms = [];

    // Перебор всех возможных значений переменных (a и b)
    for (let a = 0; a <= 1; a++) {
      for (let b = 0; b <= 1; b++) {
        const result = calculateBooleanFunction(a, b);

        // Если результат равен true, добавляем термин в СДНФ
        if (result) {
          const term = [];
          term.push(a ? "a" : "!a");
          term.push(b ? "b" : "!b");
          sdnfTerms.push(`(${term.join(" && ")})`);
        }
      }
    }

    // Соединяем термины с логическим "или"
    const sdnf = sdnfTerms.join(" || ");

    return sdnf;
  }
  const sdnfExpression = getSDNF();
  console.log(sdnfExpression);
  return (
    <div className="App">
      <TruthTableGenerator />
    </div>
  );
}

export default App;
