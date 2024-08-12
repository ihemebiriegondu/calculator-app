const displayResultsOnChangeFunction = () => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");
  
  //get all the basic operators
  const regex = /[+*\/-]/g;

  const operators = {
    "+": (a, b) => parseFloat(a) + parseFloat(b),
    "-": (a, b) => parseFloat(a) - parseFloat(b),
    "*": (a, b) => parseFloat(a) * parseFloat(b),
    "/": (a, b) => parseFloat(a) / parseFloat(b),
  };
  const operator = regex.exec(disp1Value.value);

  if (operator) {
    //console.log(operator)
    const inputValue = operator.input;
    const operatorSign = operator[0];

    //get the math operator used, the number before and after the operator was/is used
    let noBeforeSign = inputValue.lastIndexOf(operatorSign);
    let prev = inputValue.substring(0, noBeforeSign);
    let curr = inputValue.substring(noBeforeSign + 1);

    //if there is a number after the operator, update the result else the currValue will be empty
    if (curr.length > 0) {
      let calcValue = operators[operatorSign](prev, curr);
      document.querySelector("#display2-input").value = calcValue.toString();
    } else {
      document.querySelector("#display2-input").value = "";
    }
  }
};

//number display and append
const showNumbersFunction = (buttonNo) => {
  let disp1Value = document.querySelector("#display1-input");
  let disp2Value = document.querySelector("#display2-input");

  //check if the first value is 0 and remove it
  if (disp1Value.value === "0") {
    document.querySelector("#display1-input").value = "";
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
  document.querySelector("#display1-input").value = displays[0].prevDisplay;
  displayResultsOnChangeFunction();
};

//show zero only once(if its the first value) and many times after other value(s)
const showZeroFunction = (buttonNo) => {
  let disp1Value = document.querySelector("#display1-input");

  if (disp1Value.value.length <= 0) {
    document.querySelector("#display1-input").value = buttonNo.textContent;
  } else if (disp1Value.value.length > 0 && disp1Value.value.length < 30) {
    //if zero is the first and only value, more zeros won't be added else, more will be added
    for (let i = 0; i < disp1Value.value.length; i++) {
      if (disp1Value.value[i] !== "0") {
        //console.log("there are other numbers");
        document.querySelector("#display1-input").value = disp1Value.value +=
          buttonNo.textContent;

        displayResultsOnChangeFunction();
        return;
      }
    }
  }
};

//show decimal point only once, either with zero as a start or only once later
const showDecimalPointFunction = (decPoint) => {
  let disp1Value = document.querySelector("#display1-input");

  if (disp1Value.value.length <= 0) {
    document.querySelector("#display1-input").value = "0.";
  } else {
    if (disp1Value.value.includes(decPoint.textContent)) {
      //console.log("there's already point");
    } else if (disp1Value.value.length > 0 && disp1Value.value.length < 30) {
      document.querySelector("#display1-input").value = disp1Value.value +=
        decPoint.textContent;
    }
  }
};

//function to show the clicked operators
const showOperatorFunction = (operatorType) => {
  const regex = /[+*\/-]/g;

  let disp1Value = document.querySelector("#display1-input");
  console.log(operatorType);

  //check if the input is not empty and if the last value is not a decimal point, then add the operator to the inputfield
  if (
    disp1Value.value.length > 0 &&
    disp1Value.value[disp1Value.value.length - 1] !== "." &&
    !regex.test(disp1Value.value)
  ) {
    document.querySelector("#display1-input").value =
      disp1Value.value + operatorType.textContent;
  }
};

const delFunction = () => {
  let disp1Value = document.querySelector("#display1-input");

  let displays = [
    //remove numbers
    { prevDisplay: disp1Value.value.slice(0, -1) },
    { currDisplay: "" },
    { calcValue: "" },
  ];

  document.querySelector("#display1-input").value = displays[0].prevDisplay;
  displayResultsOnChangeFunction();
};

//function to clear all inputs
const clearAll = () => {
  document.querySelector("#display1-input").value = "";
  document.querySelector("#display2-input").value = "0";
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
  } else if (buttonType.classList.contains("delKey")) {
    delFunction();
  } else if (buttonType.classList.contains("acKey")) {
    clearAll();
  }
};

const keys = document.querySelectorAll(".keys");
keys.forEach((key) => {
  key.addEventListener("click", buttonsClickFunction);
});
