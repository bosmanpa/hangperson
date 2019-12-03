let phraseArray = []

document.addEventListener('DOMContentLoaded', function() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
})

function renderPhrases(phrases) {
    const phraseContainer = document.getElementById('phrase')
    const onePhrase = sample(phrases)
    const content = onePhrase.content
    console.log(content)
    phraseArray = content.toUpperCase().split('')
    console.log(phraseArray)
    const clues = phraseArray.map(function(letter) {
        if (letter === ' ') {
            return letter
        } else {
            return '_'
        }
    })
    console.log(clues)
    const unorderedLetters = document.createElement('ul')
    clues.forEach (clue => createClueLi(clue))
    // debugger
    // phrase.innerHTML = 
    // phraseContainer.appendChild(phrase)
}

function createClueLi(clue) {
    const li = document.createElement('li')
    console.log(clue)
}

function sample(array) {
    return array[Math.floor ( Math.random() * array.length )]
}