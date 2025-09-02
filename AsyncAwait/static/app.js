// helpers
const $ = (sel) => document.querySelector(sel);
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  for (const child of [].concat(children)) {
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
}
function setLoading(elRoot, isLoading) {
  elRoot.textContent = isLoading ? "Loading" : "";
  elRoot.classList.toggle("loading", isLoading);
}
function showStatus(parent, type, msg) {
  parent.textContent = "";
  parent.append(el("div", { class: type === "error" ? "error" : "ok" }, msg));
}

// Part 1 — Numbers API
const factsOutput = $("#factsOutput");
const favNumInput = $("#favNum");
const multiNumsInput = $("#multiNums");

// 1) one fact
$("#btnSingle").addEventListener("click", async () => {
  const n = favNumInput.value.trim() || "7";
  factsOutput.textContent = ""; setLoading(factsOutput, true);
  try {
    const res = await fetch(`http://numbersapi.com/${n}?json`);
    if (!res.ok) throw new Error("Numbers API failed");
    const data = await res.json();
    setLoading(factsOutput, false);
    factsOutput.append(el("div", { class: "pill" }, `#${n}`));
    factsOutput.append(el("div", {}, data.text));
  } catch (err) {
    setLoading(factsOutput, false);
    showStatus(factsOutput, "error", err.message);
  }
});

// 2) multiple numbers
$("#btnMulti").addEventListener("click", async () => {
  const raw = multiNumsInput.value.trim().replace(/\s+/g, "");
  if (!raw) return;
  const list = raw.split(",").filter(Boolean).join(",");
  factsOutput.textContent = ""; setLoading(factsOutput, true);
  try {
    const res = await fetch(`http://numbersapi.com/${list}?json`);
    if (!res.ok) throw new Error("Numbers API (multi) failed");
    const data = await res.json();
    setLoading(factsOutput, false);
    const ul = el("ul");
    for (const [num, fact] of Object.entries(data)) {
      ul.append(el("li", {}, `${num}: ${fact}`));
    }
    factsOutput.append(ul);
  } catch (err) {
    setLoading(factsOutput, false);
    showStatus(factsOutput, "error", err.message);
  }
});

// 3) four facts (parallel)
$("#btnFour").addEventListener("click", async () => {
  const n = favNumInput.value.trim() || "7";
  factsOutput.textContent = ""; setLoading(factsOutput, true);
  try {
    const urls = Array.from({ length: 4 }, () => `http://numbersapi.com/${n}?json`);
    const promises = urls.map(u => fetch(u).then(r => {
      if (!r.ok) throw new Error("Numbers API (4 facts) failed");
      return r.json();
    }));
    const results = await Promise.all(promises);
    setLoading(factsOutput, false);
    const ul = el("ul");
    results.forEach((obj, i) => ul.append(el("li", {}, `Fact ${i + 1}: ${obj.text}`)));
    factsOutput.append(ul);
  } catch (err) {
    setLoading(factsOutput, false);
    showStatus(factsOutput, "error", err.message);
  }
});

// Part 2 — Deck of Cards
const deckStatus = $("#deckStatus");
const cardsUI = $("#cardsUI");
const btnOne = $("#btnOne");
const btnTwo = $("#btnTwo");
const btnInitDeck = $("#btnInitDeck");
const btnDraw = $("#btnDraw");

// 1) draw one (console)
btnOne.addEventListener("click", async () => {
  try {
    const newDeck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(r => r.json());
    const draw = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`).then(r => r.json());
    const c = draw.cards[0];
    console.log(`${c.value.toLowerCase()} of ${c.suit.toLowerCase()}`);
  } catch (e) {
    console.error("Deck API error:", e);
  }
});

// 2) draw two (console, same deck)
btnTwo.addEventListener("click", async () => {
  try {
    const newDeck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(r => r.json());
    const draw1 = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`).then(r => r.json());
    const draw2 = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`).then(r => r.json());
    const c1 = draw1.cards[0], c2 = draw2.cards[0];
    console.log(`${c1.value.toLowerCase()} of ${c1.suit.toLowerCase()}`);
    console.log(`${c2.value.toLowerCase()} of ${c2.suit.toLowerCase()}`);
  } catch (e) {
    console.error("Deck API error:", e);
  }
});

// 3) UI deck
let currentDeckId = null;
let remaining = 0;

btnInitDeck.addEventListener("click", async () => {
  cardsUI.textContent = "";
  deckStatus.textContent = "Creating deck…";
  btnDraw.disabled = true;
  try {
    const newDeck = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(r => r.json());
    currentDeckId = newDeck.deck_id;
    remaining = newDeck.remaining;
    deckStatus.textContent = `Deck ready: ${remaining} cards remaining`;
    btnDraw.disabled = false;
  } catch (e) {
    deckStatus.textContent = "Failed to create deck.";
    console.error(e);
  }
});

btnDraw.addEventListener("click", async () => {
  if (!currentDeckId) return;
  btnDraw.disabled = true;
  deckStatus.textContent = "Drawing…";
  try {
    const draw = await fetch(`https://deckofcardsapi.com/api/deck/${currentDeckId}/draw/?count=1`).then(r => r.json());
    remaining = draw.remaining;
    deckStatus.textContent = remaining ? `${remaining} cards remaining` : "No cards left!";
    btnDraw.disabled = remaining === 0;

    const c = draw.cards[0];
    const cardEl = el("div", { class: "card" }, [
      el("div", { class: "muted" }, `${c.value} of ${c.suit}`),
      el("img", { src: c.image, alt: `${c.value} of ${c.suit}`, style: "max-width:100%;" })
    ]);
    cardsUI.prepend(cardEl);
  } catch (e) {
    deckStatus.textContent = "Draw failed.";
    console.error(e);
  } finally {
    if (remaining > 0) btnDraw.disabled = false;
  }
});
