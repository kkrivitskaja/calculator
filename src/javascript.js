class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
        this.inputLim = 11
        this.accurancy = 12
        this.VALUE_FOR_CHOSE_OPERATIONS = 10000000000000;
    }

    clear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.readyToReset = false;
    }
    setReset() {
        this.readyToReset = true;
    }

    delete() {
        if (this.currentOperand === "Error") return;
        this.currentOperand = this.currentOperand.toString().length <= 1 ? "" : this.currentOperand.toString().slice(0, -1);
    }

    pozAndNeg() {
        if (this.currentOperand == "Error") return
        if (this.currentOperand.toString().includes('-')) {
            this.currentOperand = this.currentOperand.toString().replace(/-/g, '')
        } else {
            this.currentOperand = '-' + this.currentOperand.toString()
        };
    }

    appendNumber(number) {
        if (this.readyToReset || this.currentOperand == "Error") {
            this.clear()
        }

        if (this.currentOperand.toString().length > this.inputLim || (this.currentOperand.toString() == "0" && number == "0"))
            return

        if (number === "." && this.currentOperand.includes(".")) return;
        else if (number === "." && this.currentOperand === "") {
            this.currentOperand = "0."
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === "" || this.currentOperand == "Error") return
        this.readyToReset = false;

        if (operation == '√') {
            this.operation = operation
            this.compute()
            return
        }
        if (this.operation == '√' && operation != '√') {
            this.previousOperand = ''
        }
        if (this.currentOperand !== "" && this.previousOperand !== "") this.compute();

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if ((isNaN(prev) && (isNaN(current) && this.operation != '√')) || isNaN(current)) return;
        switch (this.operation) {

            case "+":
                computation = Math.round((prev + current) * this.VALUE_FOR_CHOSE_OPERATIONS) / this.VALUE_FOR_CHOSE_OPERATIONS;

                break;

            case "-":
                computation = Math.round((prev - current) * this.VALUE_FOR_CHOSE_OPERATIONS) / this.VALUE_FOR_CHOSE_OPERATIONS;
                break;

            case "*":
                computation = Math.round((prev * current) * this.VALUE_FOR_CHOSE_OPERATIONS) / this.VALUE_FOR_CHOSE_OPERATIONS;
                break;

            case "÷":
                computation = Math.round((prev / current) * this.VALUE_FOR_CHOSE_OPERATIONS) / this.VALUE_FOR_CHOSE_OPERATIONS;
                break;

            case 'xy':
                computation = Math.pow(prev, current)
                break;

            case '√':
                this.previousOperand = this.currentOperand
                this.currentOperand = Math.round(Math.sqrt(current) * this.VALUE_FOR_CHOSE_OPERATIONS) / this.VALUE_FOR_CHOSE_OPERATIONS;
                return;

            default:

                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = "";
    }

    updateDisplay() {
        if (this.currentOperand.toString() == "NaN" || this.currentOperand.toString() == "Infinity") {
            this.currentOperand = "Error"
        }
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                this.reformulateOutputForPreviousOperand();
        } else {
            this.previousOperandTextElement.innerText = "";
        }
    }

    reformulateOutputForPreviousOperand() {
        switch (this.operation) {
            case 'xy':
                return `${this.previousOperand} ^`
            case '√':
                return `${this.operation} ${this.previousOperand}`
            default:
                return `${this.previousOperand} ${this.operation}`
        }
    }
}


const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const pozNegButton = document.querySelector("[data-poz-neg]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandTextElement,
    currentOperandTextElement);

allClearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
})

pozNegButton.addEventListener("click", () => {
    calculator.pozAndNeg();
    calculator.updateDisplay();
})

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener("click", button => {
    calculator.compute();
    calculator.setReset();
    calculator.updateDisplay();
})

deleteButton.addEventListener("click", button => {
    calculator.delete();
    calculator.updateDisplay();
})
