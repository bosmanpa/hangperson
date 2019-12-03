document.addEventListener('DOMContentLoaded', function() {
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
})

function renderPhrases(phrases) {
    const phraseContainer = document.getElementById('phrase')
    console.log(phrases)
    const phrase = document.createElement('h2')
    const onePhrase = sample(phrases)
    phrase.innerHTML = onePhrase.content
    phraseContainer.appendChild(phrase)
}

function sample(array) {
    return array[Math.floor ( Math.random() * array.length )]
}