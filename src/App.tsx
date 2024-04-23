import { useEffect, useRef, useState } from "react";

const buttons = [
  "AC", // 0
  "⌫", // 1
  "%", // 2
  "÷", // 3
  "7", // 4
  "8", // 5
  "9", // 6
  "×", // 7
  "4", // 8
  "5", // 9
  "6", // 10
  "-", // 11
  "1", // 12
  "2", // 13
  "3", // 14
  "+", // 15
  "0", // 16
  ".", // 17
  "=", // 18
];

const operations = ["+", "-", "×", "÷"];

const App = () => {
  const [input, setInput] = useState("0");
  const inputRef = useRef(null);

  const calculate = () => {
    const modifiedInput = input
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/%/g, "/100");

    try {
      setInput(eval(modifiedInput).toString());
    } catch (error) {
      alert("Invalid syntax");
      setInput("0");
    }
  };

  const handleButtonClick = (char: string) => {
    if (input.length === 18 && !["⌫", "AC", "="].includes(char)) {
      return;
    }

    // check duplicate operation
    let flagDuplicateOperation = false;

    if (operations.includes(char)) {
      operations.forEach((element) => {
        if (input.endsWith(element)) {
          flagDuplicateOperation = true;
          setInput(input.slice(0, -1) + char);
        }
      });
    }

    if (flagDuplicateOperation) {
      return;
    }
    // end check duplicate operation

    if (operations.includes(char)) {
      if (input === "0" || input === "0.") {
        return;
      }
    }

    // stop backspace from working if it's already 0
    if (char === "⌫") {
      if (input !== "0") {
        setInput(input.slice(0, -1));
      }
      return;
    }

    // set input to 0 for AC
    if (char === "AC") {
      setInput("0");
      return;
    }

    // prevent result from error
    let flagError = false;

    if (char === "=") {
      operations.forEach((element) => {
        if (input.endsWith(element)) {
          flagError = true;
        }
      });

      if (input === "0") {
        flagError = true;
      }

      let hasOperation = false;

      if (!flagError) {
        operations.forEach((element) => {
          if (input.includes(element)) {
            hasOperation = true;
          }
        });
      }

      if (hasOperation) {
        calculate();
        return;
      }

      if (flagError || !hasOperation) {
        return;
      }
    }
    // end prevent result from error

    // directly turn 0 to char to prevent stutter display
    if (input === "0") {
      setInput(char);
      return;
    }

    setInput(input + char);
  };

  useEffect(() => {
    if (input.length === 0) {
      setInput("0");
    }
  }, [input]);

  return (
    <div className="flex items-center flex-col justify-center h-screen w-screen">
      <h1 className="text-3xl font-black mb-10">Vinculator</h1>

      <div className="flex flex-col items-center justify-center gap-3">
        <input
          ref={inputRef}
          type="text"
          className="outline-none text-right text-2xl w-[268px] bg-gray-200 p-5 px-2 rounded-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="grid grid-cols-4 gap-1">
          {buttons.map((item, idx) => (
            <button
              className={`${item === "⌫" ? "font-medium" : ""} ${
                item === "0"
                  ? "w-full h-full pl-7 col-span-2"
                  : "w-16 h-16 justify-center"
              } ${
                idx <= 2
                  ? "bg-gray-400/70 hover:bg-gray-400/50"
                  : [3, 7, 11, 15, 18].includes(idx)
                  ? "bg-green-400 hover:bg-green-400/80"
                  : "bg-gray-200 hover:bg-gray-300 :bg-yellow-50"
              } rounded-full select-none flex items-center text-2xl`}
              key={idx}
              onClick={() => handleButtonClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
