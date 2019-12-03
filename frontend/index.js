let winCounter = 0
let loseCounter = 6
let phraseArray = []

document.addEventListener('DOMContentLoaded', function() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
    addButtonListener()
})

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
                    console.log('WIN')
                }
            } else {
                loseCounter --
            }
            
            event.target.disabled = true
            // debugger
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

    // const unorderedLetters = document.createElement('ul')
    phraseArray.forEach (clue => createClueLi(clue))
    // debugger
    // phrase.innerHTML = 
    // phraseContainer.appendChild(phrase)
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