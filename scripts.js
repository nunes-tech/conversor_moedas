//Model Coin
class Coin {
    codeFrom
    codeTo
    currentValue
    timestamp
    constructor(codeFrom, codeTo, currentValue, timestamp){
        this.codeFrom = codeFrom
        this.codeTo = codeTo
        this.currentValue = currentValue,
        this.timestamp = timestamp
    }
}

//Variaveis Globais
const inputCoinFrom = document.getElementById("coinFrom")
const inputCoinTo   = document.getElementById("coinTo")
const select        = document.getElementById("optionsCoin")
const spanTime      = document.getElementById("hours")
const url           = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL"
inputCoinFrom.value = 1

async function getCurrentValuesCoins(){

    try {
        const call = await fetch(url)

        if(call.status != 200) throw Error(call.status)

        const response = await call.json()

        handleDataReceivesfromApi( response )

    } catch(erro) {
        console.log("Ops! Ocorreu um erro!:", erro)
    }

}

function handleDataReceivesfromApi(response){

    const json = JSON.stringify(response, null, 2)

    const dataObject = JSON.parse(json)

    const dollar = new Coin(
        dataObject.USDBRL.code,
        dataObject.USDBRL.codein,
        dataObject.USDBRL.ask,
        dataObject.USDBRL.timestamp,
    )

    const euro = new Coin(
        dataObject.EURBRL.code,
        dataObject.EURBRL.codein,
        dataObject.EURBRL.ask,
        dataObject.EURBRL.timestamp,
    )

    showInitialData(dollar)
    setChangeListenerOnSelect( dollar, euro )
    setInputListenerOnInputCoinFrom( dollar, euro )
}

function setChangeListenerOnSelect(dollar, euro){

    select.addEventListener("change", ()=>{
        const indexSelected = select.selectedIndex
        const optionSelected = select.item(indexSelected).value
        inputCoinFrom.value = 1
        updateInputsOnDisplay(dollar, euro, optionSelected)
        setInputListenerOnInputCoinFrom(dollar, euro, optionSelected)
    })
}

function updateInputsOnDisplay(dollar, euro, option){
  
    const labelCoinFrom = document.querySelector("label[for='coinFrom']")
    const labelCoinTo = document.querySelector("label[for='coinTo']")
    inputCoinFrom.focus()
    
    switch (option) {
        case "usdBrl":
            labelCoinFrom.textContent = "Valor em Dolár"
            labelCoinTo.textContent = "Valor em Reais"
            inputCoinTo.value = parseFloat(dollar.currentValue).toFixed(2)
        break;

        case "brlUsd":
            labelCoinFrom.textContent = "Valor em Reais"
            labelCoinTo.textContent = "Valor em Dolár"
            inputCoinTo.value = parseFloat((1 / dollar.currentValue)).toFixed(2)
        break;

        case "euroBrl":
            labelCoinFrom.textContent = "Valor em Euro"
            labelCoinTo.textContent = "Valor em Reais"
            inputCoinTo.value = parseFloat(euro.currentValue).toFixed(2)
        break;

        case "brlEuro":
            labelCoinFrom.textContent = "Valor em Reais"
            labelCoinTo.textContent = "Valor em Euro"
            inputCoinTo.value = parseFloat((1 / euro.currentValue)).toFixed(2)     
        break;
    }

}

function setInputListenerOnInputCoinFrom(
    dollar, euro, optionSelected = "usdBrl"
) {

    inputCoinFrom.addEventListener("input", function() {
        const valueTyping = inputCoinFrom.value
        if(optionSelected == "brlUsd") {
            const priceBrl = (1 / dollar.currentValue)

            inputCoinTo.value = (valueTyping * priceBrl).toFixed(2)

        } else if(optionSelected == "euroBrl") {

            inputCoinTo.value = (valueTyping * euro.currentValue).toFixed(2)

        } else if(optionSelected == "brlEuro") {
            const priceBrl = (1 / euro.currentValue)

            inputCoinTo.value = (valueTyping * priceBrl).toFixed(2)
    
        } else {
            inputCoinTo.value = (valueTyping * dollar.currentValue).toFixed(2)
        }
    })

}

function showInitialData(dolar) {
    inputCoinTo.value = parseFloat(dolar.currentValue).toFixed(2)
    inputCoinFrom.focus()
}

getCurrentValuesCoins()