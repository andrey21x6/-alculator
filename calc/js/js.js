"use strict"

function calcStart() {
    const buttonAll = document.querySelectorAll('.calc-js .button')
    const outMemory = document.querySelector('.calc-js .out-memory')
    const outExpression = document.querySelector('.calc-js .out-expression')
    const outWindow = document.querySelector('.calc-js .out-window')
    let memory = 0
    let lastExpression = ''
    let result = 0
    outMemory.textContent = memory
    outExpression.textContent = lastExpression
    document.oncontextmenu = () => false

    for (let value of buttonAll) value.addEventListener('click', clickMeaning)
    document.addEventListener('keydown', keykMeaning)

    function clickMeaning() {
        let outWindowValue = document.querySelector('.calc-js .out-window').value
        const buttonValue = this.getAttribute('data')

        borderRedReset()

        if (buttonValue === 'mc') memory = 0
        else if (buttonValue === 'm+' && outWindowValue != 0 && !isNaN(Number(outWindowValue))) {
            memory = processingTheResult(Number(memory) + Number(outWindowValue))
        }
        else if (buttonValue === 'm-' && outWindowValue != 0 && !isNaN(Number(outWindowValue))) {
            memory = processingTheResult(Number(memory) - Number(outWindowValue))
        }
        else if (buttonValue === 'mr') outWindow.value = memory
        else if (buttonValue === 'ac') outWindow.value = ''
        else if (buttonValue === '+-') {

            if (outWindowValue.slice(-2) !== '+-' && outWindowValue.slice(-2) !== '-+') {
                if (outWindowValue.slice(-1) === '+') outWindow.value += '-'
                else if (outWindowValue.slice(-1) === '-') outWindow.value += '+'
            }
        }
        else if (buttonValue === '<') outWindow.value = outWindowValue.slice(0, -1)
        else if (buttonValue === '=' || buttonValue === '%') {

            if (lastCharacter(outWindowValue)) {
                outWindowValue = plusPercentage(buttonValue, outWindowValue)
                theOutcome(result, outWindowValue)
            }
        }
        else if (!buttonValue.includes('m') && buttonValue !== 'ac' && buttonValue !== '<' && buttonValue !== '=') {

            if (checkTwoOperators(outWindowValue.slice(-1), buttonValue)) outWindow.value += buttonValue
        }

        outMemoryExpression()
    }

    function keykMeaning(event) {
        const arrayKey = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/', '*', '-', '+', '=', '%', 'Enter', '.', ',', 'Backspace', 'Delete']
        let outWindowValue = document.querySelector('.calc-js .out-window').value
        let keyPressed = event.key

        borderRedReset()

        if (arrayKey.includes(event.key)) {
            if (keyPressed !== '<'
                && keyPressed !== '='
                && keyPressed !== 'Enter'
                && keyPressed !== 'Backspace'
                && keyPressed !== 'Delete'
                && keyPressed !== '%') {

                if (keyPressed === ',') keyPressed = '.'

                if (checkTwoOperators(outWindowValue.slice(-1), keyPressed)) outWindow.value += keyPressed
            }
            else if (keyPressed === 'Backspace') outWindow.value = outWindowValue.slice(0, -1)
            else if (keyPressed === 'Delete') outWindow.value = ''
            else if (keyPressed === '=' || keyPressed === 'Enter' || keyPressed === '%') {

                if (lastCharacter(outWindowValue)) {
                    outWindowValue = plusPercentage(keyPressed, outWindowValue)
                    theOutcome(result, outWindowValue)
                }
            }
        }

        outMemoryExpression()
    }

    function plusPercentage(symbol, outWindowValue) {
        if (symbol === '%') return outWindowValue += symbol
        return outWindowValue
    }

    function lastCharacter(outWindowValue) {
        return (outWindowValue.slice(-1) !== '+'
            && outWindowValue.slice(-1) !== '-'
            && outWindowValue.slice(-1) !== '*'
            && outWindowValue.slice(-1) !== '/'
            && outWindowValue.slice(-1) !== '%')
    }

    function checkTwoOperators(lastChar, symbol) {
        const twoOperators = lastChar + symbol
        const arraySymbol = ['+', '-', '*', '/', '%']

        for (let i = 0; i < arraySymbol.length; i++) {
            for (let k = 0; k < arraySymbol.length; k++) {
                if (twoOperators == (arraySymbol[i] + arraySymbol[k])) {
                    return false
                }
            }
        }

        return true
    }

    function borderRed() {
        outWindow.style.borderColor = 'red'
        outWindow.style.borderWidth = '2px'
    }

    function borderRedReset() {
        outWindow.style.borderColor = 'rgba(0, 128, 0, 0.4)'
        outWindow.style.borderWidth = '2px'
    }

    function outMemoryExpression() {
        outMemory.textContent = memory
        outExpression.textContent = lastExpression
    }

    function processingTheResult(result) {
        return (result.toFixed(10).replace(/[,.]?0+$/, ''))      //Оставляет 10 цифр после точки ||| Удаляет все нули с хвоста, даже после точки
    }

    function examination(result, outWindow, outWindowValue) {

        if (!isNaN(result)) {
            result = processingTheResult(result)
            lastExpression = outWindowValue + '=' + result
            outWindow.value = result
        }
        else borderRed()
    }

    function theOutcome(result, outWindowValue) {

        if (outWindowValue.slice(-1) === '%') {
            result = outWindowValue.slice(0, -1)

            if (result.includes('%')) borderRed()
            else {
                let operator = ''

                if (result.includes('+')) operator = '+'
                else if (result.includes('-')) operator = '-'
                else if (result.includes('/')) operator = '/'
                else borderRed()

                if (operator != '' && result.split(operator).length == 2) {
                    const arrayNumbers = result.split(operator)

                    switch (operator) {
                        case '+': result = Number(arrayNumbers[0]) + (Number(arrayNumbers[0]) / 100 * Number(arrayNumbers[1])); break
                        case '-': result = Number(arrayNumbers[0]) - (Number(arrayNumbers[0]) / 100 * Number(arrayNumbers[1])); break
                        case '/': result = 100 / Number(arrayNumbers[1]) * Number(arrayNumbers[0]); break
                    }

                    examination(result, outWindow, outWindowValue)
                }
                else {
                    result = outWindowValue
                    borderRed()
                }
            }
        }
        else {
            //Не вычисляет, если деление на 0 или 0 делят (умножают) на что-то или знак % в середине выражения

            if (outWindowValue.slice(-2) === '/0' || outWindowValue.slice(0, 2) === '0/' || outWindowValue.slice(0, 2) === '0*' || outWindowValue.includes('%')) borderRed()
            else {
                result = eval(outWindowValue.replace(/^0+/, ''))
                examination(result, outWindow, outWindowValue)
            }
        }
    }
}

calcStart()
