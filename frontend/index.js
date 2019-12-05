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
    addNewPlayer(players)
}

function addNewPlayer(players) {
    const selection = `<a id='new-player' class="dropdown-item" href="#">New Player</a>`
    const dropdown = document.querySelector('.dropdown-menu')
    dropdown.insertAdjacentHTML('beforeend', selection)
    dropdown.addEventListener('click', event => chooseOrCreatePlayer(event, players))
}

function chooseOrCreatePlayer(event, players) {
    if (event.target.innerText === 'New Player') {
        const form = document.getElementById('player-form')
        form.style.display = 'block'
    } else if (event.target.className === 'dropdown-item') {
        const chosenPlayer = players.find(player => `player-${player.id}` === event.target.id)
        currentPlayerId = chosenPlayer.id
        currentPlayerName = chosenPlayer.name
        fetchGames(currentPlayerId)
    }
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
    <br><br>
    <button id="change-player">Change Playa</button>
    `
    statsDiv.innerHTML = winLossHtml
    callButtons()
}

function callButtons() {
    deleteButton()
    resetButton()
    changePlayer()
}

function changePlayer() {
    const changeBtn = document.getElementById('change-player')
    changeBtn.addEventListener('click', () => window.location.reload())
}

function formListener() {
    const form = document.getElementById('player-form')
    form.addEventListener('submit', event => formSubmit(event, form))
}

function formSubmit(event, form) {
    event.preventDefault()
    createPlayer(event.target.children[0].value)
    form.style.display = 'none'
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
    renderStats(currentPlayerName, gameWins, gameLosses)
    const playerDropdown = document.querySelector('.dropdown')
    playerDropdown.style.display = 'none'
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    gamePlay()
}

function gamePlay() {
    renderAlphabet()
    renderPicture()
    addButtonListener()
    showGame()
}

function resetButton() {
    const resetBtn = document.getElementById('reset-button')
    resetBtn.addEventListener('click', function(){
        const result = confirm("Are you sure you want to reset your stats?")
        if (result == true) {resetGames()}
    })
}

function resetGames() {
    fetch(`http://localhost:3000/players/${currentPlayerId}/delete_games`)
    .then(resp => resp.json())
    .then(function() {
        gameWins = 0
        gameLosses = 0
        renderStats(currentPlayerName, gameWins, gameLosses)
    })
}

function deleteButton() {
    const deleteBtn = document.getElementById('delete-button')
    deleteBtn.addEventListener('click', function(){
        const result = confirm("Are you sure you want to delete this player?")
        if (result == true) {deletePlayer()}
    })
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
    fetch('http://localhost:3000/phrases')
    .then(resp => resp.json())
    .then(phrases => renderPhrases(phrases))
    renderAlphabet()
    renderPicture()
}

function newGame() {
    hideOldGame()
    winCounter = 0
    loseCounter = 6
    phraseArray = [] 
    gameReload()
}

function hideOldGame() {
    const myBody = document.querySelectorAll('.reset-my-body')
    myBody.forEach(node => node.innerText = '')
    const hideMe = document.querySelectorAll('.hide-my-body')
    hideMe.forEach(node => node.style.display = 'none')
}

function disableLetters() {
    const buttonDiv = Array.from(document.querySelector('.alphabet').children)
    buttonDiv.forEach (button => {
        button.disabled = true
        button.style.background = 'black'   
    })
}

function addButtonListener() {
    const buttonDiv = document.querySelector('.alphabet')
    buttonDiv.addEventListener('click', event => letterSelection(event))
}

function letterSelection(event) {
    let filteredArray = phraseArray.filter(letter => letter != ' ')
        if (event.target.className === 'btn btn-outline-success') {
            event.target.style.background = 'black'
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
                    celebration()
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
                    const clueArray = Array.from(clueContainer.children)
                    clueArray.forEach (clue => checkClue(clue))
                    saveGame(false)
                } 
            }
        event.target.disabled = true
        }
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
    picture.className = "border-0 border-secondary"
    picture.id = "hangman-pic"
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
    letterBtn.className = 'btn btn-outline-success'
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
// fireworks
const brd = document.createElement("DIV");
document.body.insertBefore(brd, document.getElementById("game"));
seeds = [];
particles = [];
const fwkPtcIniV = 0.5;
const fwkSedIniV = 0.5;
const fwkPtcIniT = 2500;
const fwkSedIniT = 1000;
const a = 0.0005;
const g = 0.0005;
const v = 0.3;

function newFireworkParticle(x, y, angle){
    let fwkPtc = document.createElement("DIV");
    fwkPtc.setAttribute('class', 'fireWorkParticle');
    fwkPtc.time = fwkPtcIniT;
    while(angle > 360)
        angle -= 360;
    while(angle < 0)
        angle += 360;
    fwkPtc.velocity = [];
    if(angle > 270)
    {
        fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
        fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
    }
    else if(angle > 180)
    {
        fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
        fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
    }
    else if(angle > 90)
    {
        fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
        fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
    }
    else
    {
        fwkPtc.velocity.x = fwkPtcIniV * Math.sin(angle * Math.PI / 180) * (1 - Math.random() * v);
        fwkPtc.velocity.y = fwkPtcIniV * Math.cos(angle * Math.PI / 180) * (1 - Math.random() * v);
    }
    fwkPtc.position = [];
    fwkPtc.position.x = x;
    fwkPtc.position.y = y;
    fwkPtc.style.left = fwkPtc.position.x + 'px';
    fwkPtc.style.top = fwkPtc.position.y + 'px';
    if(particles == null)
        particles = [];
    particles.push(fwkPtc);
    return fwkPtc;
}

function newFireworkSeed(x, y)
{
    var fwkSed = document.createElement("DIV");
    fwkSed.setAttribute('class', 'fireWorkSeed');
    brd.appendChild(fwkSed);
    fwkSed.time = fwkSedIniT;
    fwkSed.velocity = [];
    fwkSed.velocity.x = 0;
    fwkSed.velocity.y = fwkSedIniV;
    fwkSed.position = [];
    fwkSed.position.x = x;
    fwkSed.position.y = y;
    fwkSed.style.left = fwkSed.position.x + 'px';
    fwkSed.style.top = fwkSed.position.y + 'px';
    if(seeds == null)
        seeds = [];
    seeds.push(fwkSed);
    return fwkSed;
}

function newFireWorkStar(x, y)
{
    var fwkBch = document.createElement("DIV");
    fwkBch.setAttribute('class', 'fireWorkBatch');
    var a = 0;
    while(a < 360)
    {
        var fwkPtc = newFireworkParticle(x, y, a);
        fwkBch.appendChild(fwkPtc);
        a += 5;
    }
    brd.appendChild(fwkBch);
}
var before = Date.now();
var id = setInterval(frame, 5);

function frame()
{
    var current = Date.now();
    var deltaTime = current - before;
    before = current;
    for(i in seeds)
    {
        var fwkSed = seeds[i];
        fwkSed.time -= deltaTime;
        if(fwkSed.time > 0)
        {
            fwkSed.velocity.x -= fwkSed.velocity.x * a * deltaTime;
            fwkSed.velocity.y -= g * deltaTime + fwkSed.velocity.y * a * deltaTime;
            fwkSed.position.x += fwkSed.velocity.x * deltaTime;
            fwkSed.position.y -= fwkSed.velocity.y * deltaTime;
            fwkSed.style.left = fwkSed.position.x + 'px';
            fwkSed.style.top = fwkSed.position.y + 'px';
        }
        else
        {
            newFireWorkStar(fwkSed.position.x, fwkSed.position.y);
            fwkSed.parentNode.removeChild(fwkSed);
            seeds.splice(i, 1);
        }
    }
    for(i in particles)
    {
        var fwkPtc = particles[i];
        fwkPtc.time -= deltaTime;
        if(fwkPtc.time > 0)
        {
            fwkPtc.velocity.x -= fwkPtc.velocity.x * a * deltaTime;
            fwkPtc.velocity.y -= g * deltaTime + fwkPtc.velocity.y * a * deltaTime;
            fwkPtc.position.x += fwkPtc.velocity.x * deltaTime;
            fwkPtc.position.y -= fwkPtc.velocity.y * deltaTime;
            fwkPtc.style.left = fwkPtc.position.x + 'px';
            fwkPtc.style.top = fwkPtc.position.y + 'px';
        }
        else
        {
            fwkPtc.parentNode.removeChild(fwkPtc);
            particles.splice(i, 1);
        }
    }
}

function celebration(){        
    newFireworkSeed(200,400)
    window.setTimeout(function(){newFireworkSeed(400,400)}, 500)
    window.setTimeout(function(){newFireworkSeed(600,400)}, 1000)
    window.setTimeout(function(){newFireworkSeed(800,400)}, 1500)
    window.setTimeout(function(){newFireworkSeed(1000,400)}, 2000)

}