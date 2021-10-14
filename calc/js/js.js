"use strict"

calc()

function calc() {
    const input = '.calc-js .out-window'
    const outExpression = '.calc-js .out-expression'
    const outMemory = '.calc-js .out-memory'
    const soundOff = document.querySelector('.calc-js .sound-off')
    const myAudio = new Audio
    let sound = '0'
    myAudio.src = 'wav/Windows_Feed_Discovered.wav'

    if (localStorage.getItem('sound') != null) {
        sound = localStorage.getItem('sound')

        if (sound === '1') {
            soundOff.classList.add('sound-on')
        }
    }

    document.oncontextmenu = () => false
    soundOff.addEventListener('click', soundOnOff)
    writeValueOutMemory()
    document.addEventListener('keydown', getKeyCharacter)

    for (let value of document.querySelectorAll('.calc-js .button')) {
        value.addEventListener('click', clickMeaning)
    }

    //----------------------------------------------------------------------------------------------------------------------------

    function characterProcessing(value) {
        const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.']
        value = checkFirstCharacter(value)
        setBorderColor()

        if (sound === '1') {
            myAudio.play()
        }

        if (value === '+-' && readTheValueInput().length != 1 && readTheValueInput().slice(-1) === '+') {
            value = '-'
        }
        else {

            if (readTheValueInput().slice(-2) === '+-' && checkingAValueTnAnArray(value, array, 10)) {
                value = ''
            }
            else if (checkingAValueTnAnArray(value, array, 10) && checkingAValueTnAnArray(readTheValueInput().slice(-1), array, 10)) {
                writeValueInput(readTheValueInput().slice(0, -1))
            }
        }

        switch (value) {
            case '%': calculateThePercentage(); break
            case 'ac': writeValueInput(''); break
            case '<': writeValueInput(readTheValueInput().slice(0, -1)); break
            case 'm+': memoryComputation('+'); break
            case 'm-': memoryComputation('-'); break
            case 'mr': writeValueInput(readTheValueInput() + numberWithSpaces(readValueOutMemory())); break
            case 'mc': writeValueOutMemory(); break
            case '=':
                if (readTheValueInput().slice(-2) === '+-') {
                    setBorderColor('red')
                }
                else {
                    evaluateExpression()
                }
                break
            default:
                if (value !== '+-') {
                    writeValueInput(removeSpaces(readTheValueInput()))
                    writeValueInput(readTheValueInput() + value)
                }
        }
    }

    function memoryComputation(operator) {
        const valInput = removeSpaces(readTheValueInput())

        if (valInput != 0 && !isNaN(Number(valInput))) {
            writeValueOutMemory(processingTheResult(eval(readValueOutMemory() + operator + valInput)))
        }
    }

    function calculateThePercentage() {

        if (readTheValueInput().includes('+')) {
            getValueFromPercent('+')
        }
        else if (readTheValueInput().includes('-')) {
            getValueFromPercent('-')
        }
        else if (readTheValueInput().includes('/')) {
            getValueFromPercent('/')
        }
    }

    function getValueFromPercent(operator) {
        const arrayNumbers = readTheValueInput().split(operator)

        if (arrayNumbers[1] !== '' && arrayNumbers[1] !== '-') {

            if (operator === '/') {
                writeValueInput(numberWithSpaces(processingTheResult(eval(100 + operator + arrayNumbers[1] * arrayNumbers[0]))))
            }
            else {
                writeValueInput(numberWithSpaces(processingTheResult(eval(arrayNumbers[0] + operator + arrayNumbers[0] / 100 * arrayNumbers[1]))))
            }
        }
    }

    function clickMeaning() {
        characterProcessing(this.getAttribute('data'))
    }

    function getKeyCharacter(event) {
        const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', 'ac', '%', '=', '<', '.']
        let keySymbol = event.key
        keySymbol = keyValueReplacement(keySymbol)

        if (checkingAValueTnAnArray(keySymbol, array)) {
            characterProcessing(keySymbol)
        }
    }

    function readTheValueInput() {
        return document.querySelector(input).value
    }

    function writeValueInput(str) {
        document.querySelector(input).value = str
    }

    function writeValueOutExpression(str, result) {
        document.querySelector(outExpression).textContent = str + '=' + result
    }

    function readValueOutMemory() {
        return document.querySelector(outMemory).textContent
    }

    function writeValueOutMemory(result = 0) {
        document.querySelector(outMemory).textContent = result
    }

    function evaluateExpression() {
        let lineLength = 3

        if (readTheValueInput().slice(0, 1) === '-') {
            lineLength = 4
        }

        if (readTheValueInput().length >= lineLength) {

            if (checkExpression(readTheValueInput())) {
                let result = processingTheResult(eval(readTheValueInput()))

                result = numberWithSpaces(result)

                writeValueOutExpression(readTheValueInput(), result)
                writeValueInput(result)
            }
            else {
                setBorderColor('red')
            }
        }
    }

    function checkingAValueTnAnArray(value, array, index = 0) {
        return (array.includes(value, index))
    }

    function checkFirstCharacter(value) {
        const array = ['%', '*', '/', '+', '.']

        if (readTheValueInput() === '' && array.includes(value)) {

            return ''
        }

        if (readTheValueInput().length == 1 && ((readTheValueInput().includes('-') && array.includes(value))
            || (readTheValueInput().includes('0') && value === '0'))) {

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

    function checkExpression() {

        if (readTheValueInput().slice(-2) === '/0' || readTheValueInput().slice(0, 2) === '0/' || readTheValueInput().slice(0, 2) === '0*') {
            return false
        }

        return true
    }

    function processingTheResult(value) {
        return (value.toFixed(10).replace(/[,.]?0+$/, ''))   //Оставляет 10 цифр после точки ||| Удаляет все нули с хвоста, даже после точки
    }

    function soundOnOff() {
        this.classList.toggle('sound-on')

        if (sound === '0') {
            sound = '1'
            localStorage.setItem('sound', '1')
        }
        else {
            sound = '0'
            localStorage.setItem('sound', '0')
            this.classList.remove('sound-on')
        }
    }

    function numberWithSpaces(number) {
        return number.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')
    }

    function removeSpaces(str) {
        return str.replace(/\s/g, '')
    }

    function setBorderColor(color = 'rgba(0, 128, 0, 0.4)') {
        document.querySelector(input).style.borderColor = color
    }
}
