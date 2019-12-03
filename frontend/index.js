let winCounter = 0
let loseCounter = 6
let phraseArray = []

document.addEventListener('DOMContentLoaded', main)

function main() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
    addButtonListener()
}

function mainReload() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
}


function newGame() {
    const myBody = document.querySelectorAll('.reset-my-body')
    myBody.forEach(node => node.innerText = '')
    const hideMe = document.querySelectorAll('.hide-my-body')
    hideMe.forEach(node => node.style.display = 'none')
    winCounter = 0
    loseCounter = 6
    phraseArray = [] 
    mainReload()
}

function addButtonListener() {
    const buttonDiv = document.querySelector('.alphabet')
    buttonDiv.addEventListener('click', function(event) {
        let filteredArray = phraseArray.filter(letter => letter != ' ')
        if (event.target.className === 'btn btn-outline-primary') {
            const liNodeList = document.querySelectorAll(`li[data-id=${event.target.innerText}]`)
            const liArray = Array.from(liNodeList)
            if (liArray.length > 0) {
                liArray.forEach(li => li.innerText = li.dataset.id)
                winCounter += liArray.length
                console.log(winCounter)
                if (winCounter === filteredArray.length) {
                    console.log('WIN')
                    const winMsg = document.getElementById('winner')
                    winMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    newBtn.addEventListener('click', newGame)
                }
            } else {
                loseCounter --
                console.log(loseCounter)
                if (loseCounter === 0) {
                    console.log('YOU LOSE!')
                    const loseMsg = document.getElementById('loser')
                    loseMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    newBtn.addEventListener('click', newGame)
                } 
            }
            
            event.target.disabled = true
        }

    })
}

function renderPicture() {
    const picDiv = document.querySelector('.hangman')
    let picture = document.createElement('img')
    picture.src = 'pics/noose.jpg'
    picDiv.appendChild(picture)
}

function renderAlphabet() {
    const alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const buttonDiv = document.querySelector('.alphabet')
    alphabetArray.forEach (letter => makeButton(letter))
}

function makeButton(letter) {
    const buttonDiv = document.querySelector('.alphabet')
    const letterBtn = document.createElement('button')
    letterBtn.innerHTML = letter
    letterBtn.className = 'btn btn-outline-primary'
    buttonDiv.appendChild(letterBtn)
}

function renderPhrases(phrases) {
    const onePhrase = sample(phrases)
    const content = onePhrase.content
    phraseArray = content.toUpperCase().split('')
    console.log(phraseArray)
    phraseArray.forEach (clue => createClueLi(clue))
}

function createClueLi(clue) {
    const clueContainer = document.getElementById('phrase')
    const li = document.createElement('li')
    if (clue === ' ') {
        li.innerText = clue
    } else {
        li.innerText = '_'
    }
    li.dataset.id = clue
    li.className = 'clue'
    clueContainer.appendChild(li)
}

function sample(array) {
    return array[Math.floor ( Math.random() * array.length )]
}