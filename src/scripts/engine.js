const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playersSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};



const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function getRandomCardId() {
    const randonIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randonIndex].id;
};

async function createCardImg(IdCard, fieldSide) {
    const cardImg = document.createElement("img");
    cardImg.setAttribute("height", "100px");
    cardImg.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImg.setAttribute("data-id", IdCard);
    cardImg.classList.add("card");

    if(fieldSide === state.playersSides.player1) {
        cardImg.addEventListener("mouseover", ()=> {
        drawSelectCard(IdCard);
        });

        cardImg.addEventListener("click", () =>{
            setCardsField(cardImg.getAttribute("data-id"));
        });
    };

    return cardImg
};

async function setCardsField(PlayerCardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();
    
    await drawCardsInField(PlayerCardId, computerCardId);

    let duelResults = await checkDuelResults(PlayerCardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
};

async function drawCardsInField(playerCardId, computerCardId) {
    state.fieldCards.player.src = cardData[playerCardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
};

async function showHiddenCardFieldsImages(value) {
    if(value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if(value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
    
};

async function hiddenCardDetails() {
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
};

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
};

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block"; 
};

async function checkDuelResults(PlayerCardId, computerCardId) {
    let duelResults = "Draw"
    let playerCard = cardData[PlayerCardId];

    if(playerCard.winOf.includes(computerCardId)) {
        duelResults = "Win"
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "Lose"
        state.score.computerScore++;
        
    }
    await playAudio(duelResults)
    return duelResults
};

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playersSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove())
    
};

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = `Attribute: ${cardData[index].type}`
    
};

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randonIdCard = await getRandomCardId();
        const cardImage = await createCardImg(randonIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
    
};

async function resetDuel() {
    state.cardsSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    init()
};

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
try {
    audio.play(); 
} catch{}

};

function init() {
    showHiddenCardFieldsImages(false);

    drawCards(5, state.playersSides.player1);
    drawCards(5, state.playersSides.computer);

    const bgm = document.getElementById('bgm');
    bgm.play();
}

init();