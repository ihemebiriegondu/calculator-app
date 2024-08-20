//called when the equalto sign is pressed
const equalsToFunction = (caller) => {
  let disp2Value = document.querySelector("#display2-input");

  //if the function is called by the equakTo button
  if (caller === "equals") {
    if (disp2Value.value !== "" && disp2Value.value !== "=") {
      document.querySelector("#display1-input").value = disp2Value.value;
      document.querySelector("#display2-input").value = "=";
      document.querySelector("#display2-input").style.visibility = "hidden";
    }
  } else {
    //if the function is called in the showOperator function
    if (disp2Value.value !== "" && disp2Value.value !== "=") {
      //to perform operation when an operator is clicked not just when the equal to button is clicked
      document.querySelector("#display1-input").value = disp2Value.value;
      document.querySelector("#display2-input").value = "";
    }
  }
  localStorage.clear();
};

//changes as the input values changes
const displayResultsOnChangeFunction = () => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");
  let operator = "";
  let operatorSign = "";

  //get all the basic operators
  const regex = /[+*\/-]/g;

  const operators = {
    "+": (a, b) => parseFloat(a) + parseFloat(b),
    "-": (a, b) => parseFloat(a) - parseFloat(b),
    "*": (a, b) => parseFloat(a) * parseFloat(b),
    "/": (a, b) => parseFloat(a) / parseFloat(b),
  };

  //if the input has a minus in front, the minus wont be counted as an operator
  if (disp1Value.value[0] === "-") {
    regex.lastIndex = 1;
    operator = regex.exec(disp1Value.value);

    //if the input has an exponential, then we start counting the operator sign from after the exponential sign
  } else if (disp1Value.value.includes("e")) {
    let indexOfe = disp1Value.value.indexOf("e");
    let newOperator = regex.exec(disp1Value.value.substring(indexOfe + 2));
    if (newOperator) {
      operatorSign = newOperator[0];
    }
    operator = regex.exec(disp1Value.value);
  } else {
    operator = regex.exec(disp1Value.value);
  }

  if (operator) {
    //console.log(operator)
    const inputValue = operator.input;

    //if there is no exponential, the operator sign is the regular sign in the input field
    if (!inputValue.includes("e")) {
      operatorSign = operator[0];
    }

    //get the math operator used, the number before and after the operator was/is used
    let noBeforeSign = inputValue.lastIndexOf(operatorSign);
    let prev = inputValue.substring(0, noBeforeSign);
    let curr = inputValue.substring(noBeforeSign + 1);

    //if there is a number after the operator, update the result else the currValue will be empty
    if (curr.length > 0) {
      let calcValue = operators[operatorSign](prev, curr);
      if (
        calcValue.toString() === "Infinity" ||
        calcValue.toString() === "-Infinity" ||
        calcValue.toString() === "NaN"
      ) {
        document.querySelector("#display2-input").value = "Error";
        document.querySelector("#display2-input").style.visibility = "hidden";
      } else {
        document.querySelector("#display2-input").value = calcValue.toString();
        document.querySelector("#display2-input").style.visibility = "visible";
      }
    } else {
      document.querySelector("#display2-input").value = "";
    }
  }
};

//number display and append
const showNumbersFunction = (buttonNo) => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");

  //if the input value has % sign
  if (disp1Value.value.includes("%")) {
    //if the last value is %, multiply the input by the buttonNo
    if (disp1Value.value.endsWith("%")) {
      document.querySelector("#display1-input").value = disp1Value.value +=
        buttonNo.textContent;

      document.querySelector("#display2-input").value =
        disp2Value.value * buttonNo.textContent;
    } else {
      //if the last no is not % (i.e if its a number after another)
      let indexOfLastPer = disp1Value.value.lastIndexOf("%");
      let noAfterThePerBeforeAddingButtonNo = disp1Value.value.substring(
        indexOfLastPer + 1
      );

      document.querySelector("#display1-input").value = disp1Value.value +=
        buttonNo.textContent;

      let allNosAfterThePer = disp1Value.value.substring(indexOfLastPer + 1);

      //console.log(localStorage.getItem("beforeZero"));
      if (noAfterThePerBeforeAddingButtonNo === "0") {
        document.querySelector("#display2-input").value =
          localStorage.getItem("beforeZero") * buttonNo.textContent;
      } else if (noAfterThePerBeforeAddingButtonNo === "0.") {
        if (localStorage.getItem("beforeZero") === null) {
          document.querySelector("#display2-input").value =
            (disp2Value.value / 10) * buttonNo.textContent;
        } else {
          document.querySelector("#display2-input").value =
            (localStorage.getItem("beforeZero") / 10) * buttonNo.textContent;
        }
      } else {
        document.querySelector("#display2-input").value =
          (disp2Value.value / noAfterThePerBeforeAddingButtonNo) *
          allNosAfterThePer;
      }
    }

    //if the input value does not have any % sign
  } else {
    //check if the first value is 0 or error and remove it
    if (disp1Value.value === "0" || disp1Value.value === "Error") {
      document.querySelector("#display1-input").value = "";
      document.querySelector("#display2-input").value = "";
    }

    let displays = [
      //appendNumbers
      { prevDisplay: (disp1Value.value += buttonNo.textContent) },
      { currDisplay: "" },
      { calcValue: "" },
    ];

    //reduce fontsize as input values becomes more and also setting max no of values to 30
    const input1length = displays[0].prevDisplay.length;
    if (input1length >= 14 && input1length < 30) {
      const fontSize = Math.max(60 - input1length * 0.9, 40);
      disp1Value.style.fontSize = fontSize + "px";
    } else if (input1length > 30) {
      displays[0].prevDisplay = displays[0].prevDisplay.slice(0, 30);
    }

    //update the values
    const regex = /[+*\/-]/g;

    //if the equal to button has been pressed and there is no math symbol in the output, the prev input will start afresh from the buttonNo
    if (disp2Value.value === "=" && !regex.test(disp1Value.value)) {
      document.querySelector("#display1-input").value = buttonNo.textContent;
      document.querySelector("#display2-input").value = "";
      document.querySelector("#display2-input").style.visibility = "visible";
    } else if (disp2Value.value === "=" && disp1Value.value[0] === "-") {
      document.querySelector("#display1-input").value = buttonNo.textContent;
      document.querySelector("#display2-input").value = "";
      document.querySelector("#display2-input").style.visibility = "visible";
    } else {
      //but if it is presses after a math symbol it will be appended to the prev value
      document.querySelector("#display1-input").value = displays[0].prevDisplay;
    }
    displayResultsOnChangeFunction();
  }
};

//show zero only once(if its the first value) and many times after other value(s)
const showZeroFunction = (buttonNo) => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");

  const regex = /[+*\/-]/g;
  const operator = regex.exec(disp1Value.value);

  if (disp1Value.value.length <= 0 || disp1Value.value === "Error") {
    document.querySelector("#display1-input").value = buttonNo.textContent;
  } else if (
    disp1Value.value.length > 0 &&
    disp1Value.value.length < 30 &&
    !operator
  ) {
    if (disp2Value.value !== "=") {
      if (disp1Value.value.includes("%")) {
        if (disp1Value.value.endsWith("%")) {
          //if zero pressed after the % sign, the final output will be 0
          localStorage.setItem("beforeZero", disp2Value.value);
          document.querySelector("#display1-input").value = disp1Value.value +=
            buttonNo.textContent;
          document.querySelector("#display2-input").value = 0;
        } else {
          //console.log("zero not after %");
          const inputValue = disp1Value.value;
          let noBeforeSign = inputValue.lastIndexOf("%");

          //if zero is pressed and the number after the % is not all zero, then zero is appended to the disp1Value
          //and the disp2Value is multiplied by 10 (for each 0 added)
          if (inputValue.substring(noBeforeSign + 1) !== "0") {
            document.querySelector("#display1-input").value =
              disp1Value.value += buttonNo.textContent;
            if (!inputValue.substring(noBeforeSign + 1).includes(".")) {
              document.querySelector("#display2-input").value =
                disp2Value.value * 10;
            }
          }
        }
      } else {
        //if zero is the first and only value(before the equal to sign is pressed), more zeros won't be added, else more will be added
        for (let i = 0; i < disp1Value.value.length; i++) {
          if (disp1Value.value[i] !== "0") {
            //console.log("there are other numbers");
            document.querySelector("#display1-input").value =
              disp1Value.value += buttonNo.textContent;
            return;
          }
        }
      }
    } else {
      //if the equal to button has been pressed, the prev input will start afresh from the 0
      //but if it is presses after a math symbol it will be appended to the prev value
      document.querySelector("#display1-input").value = buttonNo.textContent;
    }
  } else if (
    disp1Value.value.length > 0 &&
    disp1Value.value.length < 30 &&
    operator
  ) {
    if (disp2Value.value === "=") {
      //if the equal to button has been pressed, the prev input will start afresh from the 0
      //but if it is presses after a math symbol it will be appended to the prev value
      document.querySelector("#display1-input").value = buttonNo.textContent;
    } else {
      const inputValue = operator.input;
      const operatorSign = operator[0];

      //get the math operator used, and the number after the operator was used
      let noBeforeSign = inputValue.lastIndexOf(operatorSign);
      let curr = inputValue.substring(noBeforeSign + 1);

      //if the only value after the operator is zero, no other zero will be added. else only one zero is added
      if (disp1Value.value.endsWith(operator[0])) {
        document.querySelector("#display1-input").value = disp1Value.value +=
          buttonNo.textContent;
      } else if (curr !== "0") {
        document.querySelector("#display1-input").value = disp1Value.value +=
          buttonNo.textContent;
      }
    }
  }
  displayResultsOnChangeFunction();
};

//show decimal point only once, either with zero as a start or only twice (before and after the operator) later
const showDecimalPointFunction = (decPoint) => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");
  let operator = "";

  const regex = /[+*\/-]/g;

  if (
    disp1Value.value.length <= 0 ||
    disp2Value.value === "=" ||
    disp1Value.value === "Error"
  ) {
    document.querySelector("#display1-input").value = "0.";
    document.querySelector("#display2-input").value = "";
  } else if (
    //if there is already a decimal point
    disp1Value.value.length > 0 &&
    disp1Value.value.length < 30 &&
    disp1Value.value.includes(decPoint.textContent)
  ) {
    if (disp1Value.value[0] === "-") {
      //if the number has '-' in the front, start counting the index from 1 instead of 0
      regex.lastIndex = 1;
      operator = regex.exec(disp1Value.value);
    } else {
      operator = regex.exec(disp1Value.value);
    }

    if (operator) {
      const inputValue = operator.input;
      const operatorSign = operator[0];

      //get the math operator used, and the number after the operator was used
      let noBeforeSign = inputValue.lastIndexOf(operatorSign);
      let curr = inputValue.substring(noBeforeSign + 1);

      //if there is a number after the operator and the number does not already have a decimal point
      if (curr.length > 0 && !curr.includes(decPoint.textContent)) {
        document.querySelector("#display1-input").value = disp1Value.value +=
          decPoint.textContent;
      } else if (curr.length <= 0) {
        document.querySelector("#display1-input").value = disp1Value.value +=
          "0.";
      }
    } else {
      if (disp1Value.value.includes("%")) {
        let noBeforePer = disp1Value.value.lastIndexOf("%");
        let curr = disp1Value.value.substring(noBeforePer + 1);

        //if there is a number after the percentage and the number does not already have a decimal point
        if (curr.length > 0 && !curr.includes(decPoint.textContent)) {
          document.querySelector("#display1-input").value = disp1Value.value +=
            decPoint.textContent;
        } else if (curr.length <= 0) {
          document.querySelector("#display1-input").value = disp1Value.value +=
            "0.";
        }
      }
    }
  } else if (
    disp1Value.value.length > 0 &&
    disp1Value.value.length < 30 &&
    !disp1Value.value.includes(decPoint.textContent)
  ) {
    if (
      regex.test(disp1Value.value.slice(-1)) ||
      disp1Value.value.endsWith("%")
    ) {
      //console.log("last value is an operator");
      document.querySelector("#display1-input").value = disp1Value.value +=
        "0.";
    } else {
      document.querySelector("#display1-input").value = disp1Value.value +=
        decPoint.textContent;
    }
  }
};

//function to show the clicked operators
const showOperatorFunction = (operatorType) => {
  const regex = /[+*\/-]/g;

  let disp1Value = document.querySelector("#display1-input");
  //console.log(operatorType);

  if (disp1Value.value.length > 0 && disp1Value.value !== "Error") {
    equalsToFunction();

    if (!regex.test(disp1Value.value.slice(-1))) {
      //if the input is not empty and if the last value is not a decimal point, then add the operator to the inputfield
      //or if there is an exponential
      if (
        (!disp1Value.value.endsWith(".") &&
          !regex.test(disp1Value.value) &&
          disp1Value.value !== "Error") ||
        disp1Value.value.includes("e")
      ) {
        document.querySelector("#display1-input").value =
          disp1Value.value + operatorType.textContent;
        document.querySelector("#display2-input").value = "";
      } else if (
        (disp1Value.value[0] === "-" && !regex.test(disp1Value.value)) ||
        disp1Value.value.includes("e")
      ) {
        //console.log("the values is negative (has - in the front)");
        //if the input field is not just the negative sign then other operators can be added
        if (disp1Value.value !== "-") {
          document.querySelector("#display1-input").value =
            disp1Value.value + operatorType.textContent;
          document.querySelector("#display2-input").value = "";
        }
      }
    } else {
      //console.log("last char is an operator");
      if (
        disp1Value.value.slice(-1) === "/" ||
        disp1Value.value.slice(-1) === "*"
      ) {
        //if the last operator is / or * and the minus button is clicked, it should be added to the input field
        if (operatorType.textContent === "-") {
          //console.log("minus after mult or div");
          document.querySelector("#display1-input").value =
            disp1Value.value + "-";
          document.querySelector("#display2-input").value = "";

          //if the last operator is / or * and the +,/,* buttons are clicked, the operator will change
        } else if (
          operatorType.textContent === "+" ||
          operatorType.textContent === "/" ||
          operatorType.textContent === "*"
        ) {
          document.querySelector("#display1-input").value =
            disp1Value.value.slice(0, -1) + operatorType.textContent;
        }
      } else if (disp1Value.value.slice(-1) === "+") {
        //if the last operator is + and the -,/,* buttons are clicked, the operator will change
        if (
          operatorType.textContent === "/" ||
          operatorType.textContent === "*" ||
          operatorType.textContent === "-"
        ) {
          document.querySelector("#display1-input").value =
            disp1Value.value.slice(0, -1) + operatorType.textContent;
        }
      } else if (disp1Value.value.slice(-1) === "-") {
        //if the last operator is - and the -,/,* buttons are clicked, the operator will change
        if (disp1Value.value !== "-") {
          //console.log(disp1Value.value.slice(-2));
          if (
            disp1Value.value.slice(-2) === "/-" ||
            disp1Value.value.slice(-2) === "*-"
          ) {
            if (operatorType.textContent !== "-") {
              document.querySelector("#display1-input").value =
                disp1Value.value.slice(0, -2) + operatorType.textContent;
            }
          } else {
            document.querySelector("#display1-input").value =
              disp1Value.value.slice(0, -1) + operatorType.textContent;
          }
        }
      }
    }
  } else {
    //if the input field is empty and the minus button is pressed, - is added
    if (operatorType.textContent === "-") {
      document.querySelector("#display1-input").value = "-";
      document.querySelector("#display2-input").value = "";
    }
  }
};

const percentageFunction = (per) => {
  const regex = /[+*\/-]/g;

  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");

  const operators = {
    "+": (a, b) => parseFloat(a) + parseFloat(b),
    "-": (a, b) => parseFloat(a) - parseFloat(b),
    "*": (a, b) => parseFloat(a) * parseFloat(b),
    "/": (a, b) => parseFloat(a) / parseFloat(b),
  };

  //if the function is called from the delete function, then the opposite of per is done (*100)
  if (per === "delete") {
    if (disp1Value.value !== "") {
      if (disp1Value.value.slice(-1) === "%") {
        document.querySelector("#display2-input").value = (
          parseFloat(disp2Value.value) * 100
        ).toString();
        document.querySelector("#display2-input").style.visibility = "visible";
      }
    }
  } else {
    if (disp1Value.value !== "") {
      //if the last char is the per symbol
      //this is for if a per symbol is placed after another
      if (disp1Value.value.slice(-1) === per.textContent) {
        const operator = regex.exec(disp1Value.value);

        //if the input value has an operator before the perecentage is added
        if (operator) {
          document.querySelector("#display1-input").value = disp1Value.value +=
            per.textContent;

          const inputValue = operator.input;
          const operatorSign = operator[0];

          let operatorIndex = inputValue.lastIndexOf(operatorSign);
          let noBeforeOperator = inputValue.substring(0, operatorIndex);
          let noAfterOperator = inputValue.substring(operatorIndex + 1);

          let noOfPercentages = inputValue.split("%").length;

          let calcAfterOperator =
            parseFloat(noAfterOperator) / 100 ** noOfPercentages;

          let calcValue = operators[operatorSign](
            noBeforeOperator,
            calcAfterOperator
          );

          document.querySelector("#display2-input").value =
            parseFloat(calcValue).toString();
        } else {
          //if there are no operators
          document.querySelector("#display1-input").value += per.textContent;

          document.querySelector("#display2-input").value = (
            parseFloat(disp2Value.value) / 100
          ).toString();
          document.querySelector("#display2-input").style.visibility =
            "visible";
        }

        //if the last char is not an operator and not the per sign(i.e the % is placed behind a no)
      } else if (!regex.test(disp1Value.value.slice(-1))) {
        if (disp1Value.value.includes("%")) {
          //if there is already % in the input field, just divide the output by 100
          document.querySelector("#display1-input").value = disp1Value.value +=
            per.textContent;

          document.querySelector("#display2-input").value = (
            parseFloat(disp2Value.value) / 100
          ).toString();
          document.querySelector("#display2-input").style.visibility =
            "visible";

          //else if the input does not have % anywhere at all (first percent)
        } else {
          const operator = regex.exec(disp1Value.value);
          //if there is an operator before adding the % (e.g 8+5%)
          if (operator) {
            const inputValue = operator.input;
            const operatorSign = operator[0];

            let operatorIndex = inputValue.lastIndexOf(operatorSign);
            let noBeforeOperator = inputValue.substring(0, operatorIndex);
            let noAfterOperator = inputValue.substring(operatorIndex + 1);
            let calcAfterOperator = "";

            if (operatorSign === "+" || operatorSign === "-") {
              calcAfterOperator = (noAfterOperator / 100) * noBeforeOperator;
            } else {
              calcAfterOperator = noAfterOperator / 100;
            }

            let calcValue = operators[operatorSign](
              noBeforeOperator,
              calcAfterOperator
            );

            document.querySelector("#display2-input").value =
              parseFloat(calcValue).toString();
            document.querySelector("#display1-input").value =
              disp1Value.value += per.textContent;

            //if there are no operators, divide the original number by 100
          } else {
            document.querySelector("#display1-input").value =
              disp1Value.value += per.textContent;

            document.querySelector("#display2-input").value = (
              parseFloat(disp1Value.value) / 100
            ).toString();
            document.querySelector("#display2-input").style.visibility =
              "visible";
          }
        }
      }
    }
  }
};

const delFunction = () => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");

  let displays = [
    //remove numbers
    { prevDisplay: disp1Value.value.slice(0, -1) },
    { currDisplay: "" },
    { calcValue: "" },
  ];
  percentageFunction("delete");

  if (disp1Value.value === "Error") {
    document.querySelector("#display1-input").value = "";
  } else {
    //if the input field has %
    if (disp1Value.value.includes("%")) {
      //if its a % thats been deleted
      if (disp1Value.value.slice(-1) === "%") {
        document.querySelector("#display1-input").value =
          displays[0].prevDisplay;
        //if after removing the %, there is no % left
        if (!disp1Value.value.includes("%")) {
          document.querySelector("#display2-input").value = "";
        }

        //if it does not end with %, but has it somewhere in the input field
      } else if (
        !disp1Value.value.endsWith("%") &&
        disp1Value.value.includes("%")
      ) {
        let indexOfLastPer = disp1Value.value.lastIndexOf("%");
        let noAfterPer = disp1Value.value.substring(indexOfLastPer + 1);

        document.querySelector("#display1-input").value =
          displays[0].prevDisplay;

        let noAfterPerAfterDel = disp1Value.value.substring(indexOfLastPer + 1);

        if (noAfterPer !== "") {
          if (noAfterPer === "0.") {
            document.querySelector("#display2-input").value = "0";
          } else if (noAfterPer === "0") {
            document.querySelector("#display2-input").value =
              localStorage.getItem("beforeZero");
          } else {
            if (noAfterPerAfterDel !== "") {
              document.querySelector("#display2-input").value =
                (disp2Value.value / noAfterPer) * noAfterPerAfterDel;
            } else {
              document.querySelector("#display2-input").value =
                disp2Value.value / noAfterPer;
            }
          }
        }
      }
    } else {
      if (disp1Value.value.includes("e")) {
        if (
          disp1Value.value.slice(-2) === "e-" ||
          disp1Value.value.slice(-2) === "e+"
        ) {
          document.querySelector("#display1-input").value =
            disp1Value.value.slice(0, -2);
        } else {
          document.querySelector("#display1-input").value =
            displays[0].prevDisplay;
        }
      } else {
        document.querySelector("#display1-input").value =
          displays[0].prevDisplay;
      }
    }
  }
  displayResultsOnChangeFunction();
};

//function to clear all inputs
const clearAll = () => {
  document.querySelector("#display1-input").value = "";
  document.querySelector("#display2-input").value = "";
  localStorage.clear();
};

const buttonsClickFunction = (event) => {
  let buttonType = event.target;

  //console.log(buttonType.classList);
  if (buttonType.classList.contains("noKeys")) {
    showNumbersFunction(buttonType);
  } else if (buttonType.classList.contains("zeroKey")) {
    showZeroFunction(buttonType);
  } else if (buttonType.classList.contains("pointKey")) {
    showDecimalPointFunction(buttonType);
  } else if (buttonType.classList.contains("opkeys")) {
    showOperatorFunction(buttonType);
  } else if (buttonType.classList.contains("perKey")) {
    percentageFunction(buttonType);
  } else if (buttonType.classList.contains("delKey")) {
    delFunction();
  } else if (buttonType.classList.contains("acKey")) {
    clearAll();
  } else if (buttonType.classList.contains("equalsKey")) {
    equalsToFunction("equals");
  }
};

const keys = document.querySelectorAll(".keys");
keys.forEach((key) => {
  key.addEventListener("click", buttonsClickFunction);
});
