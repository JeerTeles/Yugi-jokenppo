// objeto
const state = {
    score: {
        playScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
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

    actions:{
        button: document.getElementById("next-duel"),
    }

    
}

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Dragão Branco De Olhos Azuis",
        type: "Dragão",
        img: `${pathImages}Dragao-branco de olhos-azuis.jpg`,
        winOf: [1, 4],
        loseOf: [2]
    },

    {
        id: 1,
        name: "Mago Negro",
        type: "Mago",
        img: `${pathImages}Mago-Negro.jpg`,
        winOf: [2, 5],
        loseOf: [0],
    },

    {
        id: 2,
        name: "Exodia",
        type: "Tessoura",
        img: `${pathImages}Exodia.jpg`,
        winOf: [0, 3, 4],
        loseOf: [1],
    },

    {
        id: 3,
        name: "Dragão Negro De Olhos Vemelhos",
        type: "Dragão",
        img: `${pathImages}red-dra.jpg`,
        winOf: [1, 4],
        loseOf: [2]
    },

    {
        id: 4,
        name: "Guardião Celta",
        type: "Guerreiro",
        img: `${pathImages}Guardiao-Celta.jpg`,
        winOf: [1],
        loseOf: [2, 3]
    },

    {
        id: 5,
        name: "Dragão Amaldiçoado",
        type: "Dragão",
        img: `${pathImages}dragão-amaldiçoado.jpg`,
        winOf: [1, 4],
        loseOf: [2]
    },

    {
        id: 6,
        name: "Cavaleiro Gaia",
        type: "Cavaleiro",
        img: `${pathImages}cavaleiro-gaia.jpg`,
        winOf: [2, 4, 5],
        loseOf: [1, 2]
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"))
        })

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard)
        });
    }

 

    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCarid =  await getRandomCardId();

    state.fieldCards.player.style.display = "block",
    state.fieldCards.computer.style.display = "block",

    await hiddenCradetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCarid].img;

    let  duelResults = await checkDuelResults(cardId, computerCarid);

    await updateScore();
    await drawButton(duelResults)
}

async function hiddenCradetails() {
    state.cardsSprites.avatar.src = "";
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Venceu: ${state.score.playScore} | Perdeu: ${state.score.computerScore}`
    
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block"; 
}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId]

    if (playerCard.winOf.includes(ComputerCardId)) {
        duelResults = "Ganhou";
        await playAudioWin(duelResults);
        state.score.playScore++;
    } else if (playerCard.loseOf.includes(ComputerCardId)) {
        duelResults = "Perdeu";
        await playAudioLose(duelResults);
        state.score.computerScore++;
    } else {
        await playAudioDraw(duelResults);
    }
    

    return duelResults;
}

async function removeAllCardsImages() {

    let cards = document.querySelector("#computer-cards");
    let imgElments = cards.querySelectorAll("img");
    imgElments.forEach((img) => img.remove());

    cards = document.querySelector("#player-cards");
    imgElments = cards.querySelectorAll("img");
    imgElments.forEach((img) => img.remove());
}

async function drawCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Tipo : " + cardData[index].type;
}

async function resetDuel() {
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudioDraw(status) {
    const audio = new Audio(`./src/assets/audios/${status}.mp3`);
    audio.play()
}

async function playAudioWin(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play()
}

async function playAudioLose(status) {
    const audio = new Audio(`./src/assets/audios/${status}.mp3`);
    audio.play()
}

// função para chamar o estado inicial do jogo
function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play()
}

init()