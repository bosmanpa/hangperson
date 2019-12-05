let winCounter = 0
let loseCounter = 6
let phraseArray = []
let currentPlayerId 
let currentPlayerName
let currentPhraseId
let gameWins
let gameLosses
let playerGames

document.addEventListener('DOMContentLoaded', main)

function main() {
    fetchPlayers()
    formListener()

}

function fetchPlayers() {
    fetch('http://localhost:3000/players')
    .then(resp => resp.json())
    .then(players => addDropdowns(players))
}

function addDropdowns(players) {
    players.forEach (player => addDropdown(player))
    const selection = `<a id='new-player' class="dropdown-item" href="#">New Player</a>`
    const dropdown = document.querySelector('.dropdown-menu')
    dropdown.insertAdjacentHTML('beforeend', selection)
    dropdown.addEventListener('click', function(event) {
        if (event.target.innerText === 'New Player') {
            // create new player
            const form = document.getElementById('player-form')
            form.style.display = 'block'
        } else if (event.target.className === 'dropdown-item') {
            const chosenPlayer = players.find(player => `player-${player.id}` === event.target.id)
            currentPlayerId = chosenPlayer.id
            currentPlayerName = chosenPlayer.name
            fetchGames(currentPlayerId)
        }
    })
}

function fetchGames(playerId) {
    fetch('http://localhost:3000/games')
    .then(resp => resp.json())
    .then(games => filterGames(games, playerId))
}

function filterGames(games, playerId) {
    playerGames = games.filter(game => game.player_id === playerId)
    gameWins = playerGames.filter(game => game.win === true).length
    gameLosses = playerGames.filter(game => game.win === false).length
    renderGame()
}

function renderStats(playerName, winNumber, lossNumber) {
    const statsDiv = document.getElementById('player-stats')
    const winLossHtml = `
    <h3>${playerName}</h3>
    <h4>Wins: ${winNumber}</h4>
    <h4>Losses: ${lossNumber}</h4>
    <button id="delete-button">Delete Player</button>
    <br><br>
    <button id="reset-button">Reset Games</button>
    `
    statsDiv.innerHTML = winLossHtml
    deleteButton()
    resetButton()
}

function formListener() {
    const form = document.getElementById('player-form')
    form.addEventListener('submit', function(event) {
        event.preventDefault()
        createPlayer(event.target.children[0].value)
        form.style.display = 'none'
    })
}

function createPlayer(name) {
    const postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({name: name})
    }

    fetch('http://localhost:3000/players', postObj)
    .then(resp => resp.json())
    .then(player => logInNewPlayer(player))
}

function logInNewPlayer(player) {
    currentPlayerId = player.id
    currentPlayerName = player.name
    gameWins = 0
    gameLosses = 0
    renderGame()
}

function addDropdown(player) {
    const dropdown = document.querySelector('.dropdown-menu')
    const selection = `<a id='player-${player.id}' class="dropdown-item" href="#">${player.name}</a>`
    dropdown.insertAdjacentHTML('beforeend', selection)
}

function renderGame() {
    // welcome player
    renderStats(currentPlayerName, gameWins, gameLosses)
    const playerDropdown = document.querySelector('.dropdown')
    playerDropdown.style.display = 'none'
    const phraseContainer = document.getElementById('phrase')
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
    addButtonListener()
    showGame()
}

function resetButton() {
    const resetBtn = document.getElementById('reset-button')
    resetBtn.addEventListener('click', resetGames)
}

function resetGames() {
    fetch(`http://localhost:3000/players/${currentPlayerId}/delete_games`)
    .then(resp => resp.json())
    .then(function() {
        gameWins = 0
        gameLosses = 0
        renderStats(currentPlayerName, gameWins, gameLosses)
        deleteButton()
    })
}

function deleteButton() {
    const deleteBtn = document.getElementById('delete-button')
    deleteBtn.addEventListener('click', deletePlayer)
}

function deletePlayer() {
    fetch(`http://localhost:3000/players/${currentPlayerId}`, { method: 'DELETE'})
    .then(resp => resp.json())
    .then(window.location.reload())
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
    deleteButton()
    resetButton()
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
                // Win Situation
                if (winCounter === filteredArray.length) {
                    const winMsg = document.getElementById('winner')
                    winMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    gameWins ++
                    renderStats(currentPlayerName, gameWins, gameLosses)
                    newBtn.addEventListener('click', newGame)
                    disableLetters()
                    saveGame(true)
                }
                // Lose Situation
            } else {
                loseCounter --
                let picture = document.querySelector('img')
                picture.src = `pics/${loseCounter}.png`
                if (loseCounter === 0) {
                    const loseMsg = document.getElementById('loser')
                    loseMsg.style.display = 'inline'
                    const newBtn = document.getElementById('new-game-btn')
                    newBtn.style.display = 'inline'
                    gameLosses ++
                    renderStats(currentPlayerName, gameWins, gameLosses)
                    newBtn.addEventListener('click', newGame)
                    disableLetters()
                    const clueContainer = document.getElementById('phrase')
                    // console.log(clueContainer.children)
                    const clueArray = Array.from(clueContainer.children)
                    clueArray.forEach (clue => checkClue(clue))
                    saveGame(false)
                } 
            }
            event.target.disabled = true
        }

    })
}

function saveGame(winOrLose) {
    const fetchBody = {
        player_id: currentPlayerId,
        phrase_id: currentPhraseId,
        win: winOrLose
    }

    const postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(fetchBody)
    }

    fetch('http://localhost:3000/games', postObj)
    .then(resp => resp.json())
    .then(game => console.log(game))
    // render wins and losses for player
    .catch(error => console.log(error))
    
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
    picture.src = `pics/${loseCounter}.png`
    picture.className = "border border-secondary"
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
    letterBtn.style.width = "38px"
    buttonDiv.appendChild(letterBtn)
}

function renderPhrases(phrases) {
    const onePhrase = sample(phrases)
    currentPhraseId = onePhrase.id
    const content = onePhrase.content
    const cleanContent = content.normalize('NFD').replace(/[^a-zA-Z ]/g, "")
    phraseArray = cleanContent.toUpperCase().split('')
    console.log(phraseArray)
    phraseArray.forEach (clue => createClueLi(clue))
    renderCategory(onePhrase)
}

function renderCategory(onePhrase) {
    const clueContainer = document.getElementById('phrase')
    const categoryHtml = `<h4>Hint: ${onePhrase.category}</h4>`
    clueContainer.insertAdjacentHTML('beforeend', categoryHtml)
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