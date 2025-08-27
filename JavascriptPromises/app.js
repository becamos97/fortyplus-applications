/***** Part 1: Number Facts (Promises) *****/

const factsList = document.querySelector("#facts-list");
const factsMsg  = document.querySelector("#facts-msg");
const favInput  = document.querySelector("#fav-number");
const multInput = document.querySelector("#multi-nums");

document.querySelector("#btn-one-fact").addEventListener("click", getOneFact);
document.querySelector("#btn-multi-facts").addEventListener("click", getMultipleFactsOneRequest);
document.querySelector("#btn-four-facts").addEventListener("click", getFourFactsParallel);

function clearFacts() {
  factsList.innerHTML = "";
  factsMsg.textContent = "";
}

function addFact(text) {
  const li = document.createElement("li");
  li.textContent = text;
  factsList.appendChild(li);
}

/** 1) Get one fact about favorite number */
function getOneFact() {
  clearFacts();
  const n = favInput.value || 7;
  // numbersapi supports HTTPS + ?json
  axios.get(`http://numbersapi.com/${n}?json`)
    .then(resp => {
      addFact(resp.data.text);
    })
    .catch(err => {
      factsMsg.textContent = "Error fetching number fact.";
      factsMsg.className = "error";
      console.error(err);
    });
}

/** 2) Get multiple numbers (in one request) and print all facts */
function getMultipleFactsOneRequest() {
  clearFacts();
  const raw = multInput.value.trim();
  if (!raw) {
    factsMsg.textContent = "Enter comma-separated numbers first.";
    factsMsg.className = "error";
    return;
  }
  const cleaned = raw.replace(/\s+/g, "");
  axios.get(`http://numbersapi.com/${cleaned}?json`)
    .then(resp => {
      // Response is an object: { "3": "...", "7": "...", ... }
      Object.entries(resp.data).forEach(([num, fact]) => addFact(`${num}: ${fact}`));
    })
    .catch(err => {
      factsMsg.textContent = "Error fetching multiple number facts.";
      factsMsg.className = "error";
      console.error(err);
    });
}

/** 3) Get 4 facts about favorite number (parallel with Promise.all) */
function getFourFactsParallel() {
  clearFacts();
  const n = favInput.value || 7;
  const urls = Array.from({ length: 4 }, () => `http://numbersapi.com/${n}?json`);
  const requests = urls.map(u => axios.get(u));

  Promise.all(requests)
    .then(responses => {
      responses.forEach(r => addFact(r.data.text));
      factsMsg.textContent = "Fetched 4 facts in parallel.";
      factsMsg.className = "success";
    })
    .catch(err => {
      factsMsg.textContent = "Error fetching one or more facts.";
      factsMsg.className = "error";
      console.error(err);
    });
}


/***** Part 2: Deck of Cards (Promises) *****/

const btnOneCard  = document.querySelector("#btn-one-card");
const btnTwoCards = document.querySelector("#btn-two-cards");
const btnNewDeck  = document.querySelector("#btn-new-deck");
const btnDraw     = document.querySelector("#btn-draw-card");
const deckMsg     = document.querySelector("#deck-msg");
const cardsGrid   = document.querySelector("#cards-grid");

let currentDeckId = null;

btnOneCard.addEventListener("click", drawOneFromNewDeck_Log);
btnTwoCards.addEventListener("click", drawTwoFromSameNewDeck_Log);
btnNewDeck.addEventListener("click", createNewDeckUI);
btnDraw.addEventListener("click", drawOneToUI);

/** Step 1: 1 card from a NEW deck, log value + suit */
function drawOneFromNewDeck_Log() {
  axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(resp => {
      const deckId = resp.data.deck_id;
      return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(drawResp => {
      const card = drawResp.data.cards[0];
      console.log(`${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`);
    })
    .catch(err => {
      console.error("Error drawing one card:", err);
    });
}

/** Step 2: 2 cards from the SAME new deck (chained), log both */
function drawTwoFromSameNewDeck_Log() {
  let deckId;
  let firstCard;

  axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(resp => {
      deckId = resp.data.deck_id;
      return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(draw1 => {
      firstCard = draw1.data.cards[0];
      return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    })
    .then(draw2 => {
      const secondCard = draw2.data.cards[0];
      console.log(`${firstCard.value.toLowerCase()} of ${firstCard.suit.toLowerCase()}`);
      console.log(`${secondCard.value.toLowerCase()} of ${secondCard.suit.toLowerCase()}`);
    })
    .catch(err => {
      console.error("Error drawing two cards:", err);
    });
}

/** Step 3 (UI): Create a new deck, enable Draw button */
function createNewDeckUI() {
  deckMsg.textContent = "Creating new deck…";
  cardsGrid.innerHTML = "";
  btnDraw.disabled = true;

  axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(resp => {
      currentDeckId = resp.data.deck_id;
      btnDraw.disabled = false;
      deckMsg.textContent = `New deck ready (remaining: ${resp.data.remaining}).`;
      deckMsg.className = "muted";
    })
    .catch(err => {
      deckMsg.textContent = "Error creating deck.";
      deckMsg.className = "error";
      console.error(err);
    });
}

/** Draw 1 card into the UI until deck is empty */
function drawOneToUI() {
  if (!currentDeckId) return;
  btnDraw.disabled = true;

  axios.get(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=1`)
    .then(resp => {
      const { remaining, cards } = resp.data;
      if (cards.length === 0) {
        deckMsg.textContent = "No cards left!";
        deckMsg.className = "error";
        return;
      }
      const card = cards[0];
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = `${card.value} of ${card.suit}`;
      img.className = "card-img";
      cardsGrid.appendChild(img);

      const angle = (Math.random() * 10) - 5; // -5 to +5 degrees
      img.style.transform = `rotate(${angle}deg)`;
      img.style.transformOrigin = "center";
      img.style.boxShadow = "0 6px 14px rgba(0,0,0,.35)";

      deckMsg.textContent = `Drew: ${card.value} of ${card.suit}. Remaining: ${remaining}`;
      deckMsg.className = remaining ? "muted" : "success";

      if (remaining === 0) {
        btnDraw.disabled = true;
        deckMsg.textContent = "Deck exhausted. Create a new deck to continue.";
      } else {
        btnDraw.disabled = false;
      }
    })
    .catch(err => {
      deckMsg.textContent = "Error drawing a card.";
      deckMsg.className = "error";
      console.error(err);
      btnDraw.disabled = false;
    });
}

const btnReshuffle = document.querySelector("#btn-reshuffle");

btnNewDeck.addEventListener("click", () => {
  // ... your existing code ...
  btnReshuffle.disabled = true;  // until the first draw or when deck exists
});

function createNewDeckUI() {
  deckMsg.textContent = "Creating new deck…";
  cardsGrid.innerHTML = "";
  btnDraw.disabled = true;
  btnReshuffle.disabled = true;

  axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(resp => {
      currentDeckId = resp.data.deck_id;
      btnDraw.disabled = false;
      btnReshuffle.disabled = false;            // <—
      deckMsg.textContent = `New deck ready (remaining: ${resp.data.remaining}).`;
      deckMsg.className = "muted";
    })
    .catch(err => {
      deckMsg.textContent = "Error creating deck.";
      deckMsg.className = "error";
      console.error(err);
    });
}

btnReshuffle.addEventListener("click", () => {
  if (!currentDeckId) return;
  btnDraw.disabled = true;
  btnReshuffle.disabled = true;
  deckMsg.textContent = "Reshuffling…";

  axios.get(`https://deckofcardsapi.com/api/deck/${currentDeckId}/shuffle/`)
    .then(resp => {
      deckMsg.textContent = `Deck reshuffled (remaining: ${resp.data.remaining}).`;
      deckMsg.className = "success";
      btnDraw.disabled = false;
      btnReshuffle.disabled = false;
      cardsGrid.innerHTML = "";
    })
    .catch(err => {
      deckMsg.textContent = "Error reshuffling.";
      deckMsg.className = "error";
      btnDraw.disabled = false;
      btnReshuffle.disabled = false;
      console.error(err);
    });
});

/***** Part 3: Pokémon (Promises) *****/

// Query elements 
const btnPokemon = document.querySelector("#btn-random-pokemon");
const pokeMsg    = document.querySelector("#poke-msg");
const pokeGrid   = document.querySelector("#poke-grid");

// Bail early if the section isn't in the DOM yet (prevents null errors)
if (!btnPokemon || !pokeMsg || !pokeGrid) {
  console.warn("Pokémon elements not found. Ensure the Pokémon section is ABOVE <script src='./app.js'>.");
} else {
  // Hook up the click using the same names below
  btnPokemon.addEventListener("click", getRandomPokemons);
}

function getRandomIds(count = 3, max = 151) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
}

function getRandomPokemons() {
  pokeGrid.innerHTML = "";
  pokeMsg.textContent = "Fetching Pokémon…";
  pokeMsg.className = "muted";
  btnPokemon.disabled = true;

  const ids = getRandomIds(3);
  const requests = ids.map(id => axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`));

  Promise.all(requests)
    .then(responses => {
      responses.forEach(({ data: p }) => {
        const div = document.createElement("div");
        div.className = "stack";
        div.innerHTML = `
          <h3 style="text-transform:capitalize">${p.name}</h3>
          <img src="${p.sprites.front_default}" alt="${p.name}">
          <p class="muted">Type(s): ${p.types.map(t => t.type.name).join(", ")}</p>
        `;
        pokeGrid.appendChild(div);
      });
      pokeMsg.textContent = "Fetched 3 Pokémon successfully!";
      pokeMsg.className = "success";
    })
    .catch(err => {
      pokeMsg.textContent = "Error fetching Pokémon.";
      pokeMsg.className = "error";
      console.error(err);
    })
    .finally(() => {
      btnPokemon.disabled = false;
    });
}