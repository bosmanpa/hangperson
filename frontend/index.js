let winCounter = 0
let loseCounter = 6
let phraseArray = []

document.addEventListener('DOMContentLoaded', main)

function main() {

}

function renderGame() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
    addButtonListener()
    showGame()
}

function showGame() {
    const game = document.getElementById('game')
    game.style.display = 'block'
}

function gameReload() {
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
    gameReload()
}

function disableLetters() {
    const buttonDiv = Array.from(document.querySelector('.alphabet').children)
    buttonDiv.forEach (button => button.disabled = true)
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
                if (winCounter === filteredArray.length) {
                    const winMsg = document.getElementById('winner')
                    winMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    newBtn.addEventListener('click', newGame)
                    disableLetters()
                }
            } else {
                loseCounter --
                let picture = document.querySelector('img')
                picture.src = `pics/${loseCounter}.jpg`
                if (loseCounter === 0) {
                    const loseMsg = document.getElementById('loser')
                    loseMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    newBtn.addEventListener('click', newGame)
                    disableLetters()
                    const clueContainer = document.getElementById('phrase')
                    // console.log(clueContainer.children)
                    const clueArray = Array.from(clueContainer.children)
                    clueArray.forEach (clue => checkClue(clue))
                } 
            }
            event.target.disabled = true
        }

    })
}

function checkClue(clue) {
    if (clue.innerText === '_') {
        clue.innerText = clue.dataset.id
        clue.style.color = 'red'
    }
}

function renderPicture() {
    const picDiv = document.querySelector('.hangman')
    let picture = document.createElement('img')
    picture.src = `pics/${loseCounter}.jpg`
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