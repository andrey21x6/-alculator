"use strict"

function calc() {
    const input = '.calc-js .out-window'

    document.oncontextmenu = () => false

    for (let value of document.querySelectorAll('.calc-js .button')) {
        value.addEventListener('click', clickMeaning)
    }

    function clickMeaning() {
        characterProcessing(this.getAttribute('data'))
    }

    function readTheValueInput() {
        return document.querySelector(input).value
    }

    function outputValueInput(string) {
        document.querySelector(input).value = string
    }

    function evaluateExpression() {
        outputValueInput(eval(readTheValueInput()))
    }

    function checkingAValueTnAnArray(value, array, index = 0) {
        return (array.includes(value, index))
    }

    function plusMinus(value) {

        if (readTheValueInput().slice(-1) === '+') {
            return '-'
        }
        else if (readTheValueInput().slice(-1) === '-') {
            return '+'
        }

        return
    }

    function characterProcessing(value) {
        const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+-', '.', ',', '/', '*', '-', '+']

        if (value === '+-') {
            value = plusMinus(value)
        }
        else if (checkingAValueTnAnArray(value, array, 13) && checkingAValueTnAnArray(readTheValueInput().slice(-1), array, 13)) {
            outputValueInput(readTheValueInput().slice(0, -1))
        }

        if (checkingAValueTnAnArray(value, array)) {
            outputValueInput(readTheValueInput() + value)
        }
        else if (value === '=') {
            evaluateExpression()
        }
        else if (value === 'ac') {
            outputValueInput('')
        }
    }
}

calc()
