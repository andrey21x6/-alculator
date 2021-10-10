"use strict"

calc()

function calc() {
    const input = '.calc-js .out-window'

    document.oncontextmenu = () => false
    document.addEventListener('keydown', getKeyCharacter)

    for (let value of document.querySelectorAll('.calc-js .button')) {
        value.addEventListener('click', clickMeaning)
    }

    //-------------------------------------------------------------------------------------------

    function characterProcessing(value) {
        const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.']

        value = keyValueReplacement(value)
        value = checkFirstCharacter(value)

        setBorderGreen()

        if (value === '+-') {
            value = plusMinus(value)
        }
        else {

            if (checkingAValueTnAnArray(value, array, 10) && checkingAValueTnAnArray(readTheValueInput().slice(-1), array, 10)) {
                writeValueInput(readTheValueInput().slice(0, -1))
            }
        }

        if (value === '%') {
            calculateThePercentage()
        }
        else if (checkingAValueTnAnArray(value, array)) {
            writeValueInput(readTheValueInput() + value)
        }
        else if (value === '=') {
            evaluateExpression()
        }
        else if (value === 'ac') {
            writeValueInput('')
        }
        else if (value === '<') {
            writeValueInput(readTheValueInput().slice(0, -1))
        }
    }

    function calculateThePercentage() {

        if (readTheValueInput().includes('%')) {
            setBorderRed()
        }
        else {

            if (readTheValueInput().includes('+') && readTheValueInput().split('+').length == 2) {
                const arrayNumbers = readTheValueInput().split('+')

                if (arrayNumbers[1] !== '') {
                    writeValueInput(Number(arrayNumbers[0]) + (Number(arrayNumbers[0]) / 100 * Number(arrayNumbers[1])))
                }
            }
            else if (readTheValueInput().includes('-') && readTheValueInput().split('-').length == 2) {
                const arrayNumbers = readTheValueInput().split('-')

                if (arrayNumbers[1] !== '') {
                    writeValueInput(Number(arrayNumbers[0]) - (Number(arrayNumbers[0]) / 100 * Number(arrayNumbers[1])))
                }
            }
            else if (readTheValueInput().includes('/') && readTheValueInput().split('/').length == 2) {
                const arrayNumbers = readTheValueInput().split('/')

                if (arrayNumbers[1] !== '') {
                    writeValueInput(100 / Number(arrayNumbers[1]) * Number(arrayNumbers[0]))
                }
            }
        }
    }

    function clickMeaning() {
        characterProcessing(this.getAttribute('data'))
    }

    function getKeyCharacter(event) {
        characterProcessing(event.key)
    }

    function readTheValueInput() {
        return document.querySelector(input).value
    }

    function writeValueInput(string) {
        document.querySelector(input).value = string
    }

    function evaluateExpression() {
        let lineLength = 3

        if (readTheValueInput().slice(0, 1) === '-') {
            lineLength = 4
        }

        if (readTheValueInput().length >= lineLength) {
            writeValueInput(eval(readTheValueInput()))
        }
    }

    function checkingAValueTnAnArray(value, array, index = 0) {
        return (array.includes(value, index))
    }

    function checkFirstCharacter(value) {
        const array = ['%', '*', '/', '+', '.']

        if ((readTheValueInput() === '' && array.includes(value)) ||
            (readTheValueInput().length == 1 && readTheValueInput().includes('-') && array.includes(value))) {
            return ''
        }

        return value
    }

    function keyValueReplacement(value) {

        switch (value) {
            case 'Enter': value = '='; break
            case 'Backspace': value = '<'; break
            case 'Delete': value = 'ac'; break
            case ',': value = '.'; break
        }

        return value
    }

    function plusMinus(value) {

        if (readTheValueInput().length != 1) {

            if (readTheValueInput().slice(-1) === '+') {
                return '-'
            }
            else if (readTheValueInput().slice(-1) === '-') {
                return '+'
            }
        }

        return
    }

    function setBorderRed() {
        document.querySelector(input).style.borderColor = 'red'
    }

    function setBorderGreen() {
        document.querySelector(input).style.borderColor = 'rgba(0, 128, 0, 0.4)'
    }
}
