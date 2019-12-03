
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
        if (event.target.className === 'btn btn-outline-primary') {
            console.log(event.target) 
            const liNodeList = document.querySelectorAll(`li[data-id=${event.target.innerText}]`)
            const liArray = Array.from(liNodeList)
            console.log(liArray)
            liArray.forEach(li => li.innerText = li.dataset.id)
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
    console.log(content)
    let phraseArray = content.toUpperCase().split('')
    console.log(phraseArray)

    // const clues = phraseArray.map(function(letter) {
    //     if (letter === ' ') {
    //         return letter
    //     } else {
    //         return '_'
    //     }
    // })

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