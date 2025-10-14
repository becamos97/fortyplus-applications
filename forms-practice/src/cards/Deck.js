import React, { useEffect, useRef, useState } from "react";

/**
 * Deck of Cards app:
 * - On mount: create+shuffle a new deck.
 * - "Draw Card": draw one card, append to table; if none left -> alert.
 * - "Shuffle Deck": shuffle existing deck, clear drawn cards; disable while shuffling.
 * - Cleans up in-flight fetches with AbortController on unmount.
 */
export default function Deck() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [cards, setCards] = useState([]);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  const abortRef = useRef(new AbortController());

  // helpers
  async function request(url, opts = {}) {
    const signal = abortRef.current.signal;
    const res = await fetch(url, { ...opts, signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // Create a new shuffled deck on first mount
  useEffect(() => {
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    async function createDeck() {
      try {
        setLoadingDeck(true);
        // new + shuffle in a single call
        const data = await request(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        setDeckId(data.deck_id);
        setRemaining(data.remaining); // 52
        setCards([]);
      } catch (err) {
        console.error("Create deck error:", err);
        window.alert("Error creating deck — check your network.");
      } finally {
        setLoadingDeck(false);
      }
    }

    createDeck();

    return () => {
      ctrl.abort(); // cleanup on unmount
    };
  }, []);

  async function handleDraw() {
    if (!deckId) return;
    if (remaining <= 0) {
      window.alert("Error: no cards remaining!");
      return;
    }

    try {
      setDrawing(true);
      const data = await request(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      if (!data.success) throw new Error("Draw failed");
      const [card] = data.cards;
      setCards(cs => [...cs, card]);
      setRemaining(data.remaining);
    } catch (err) {
      console.error("Draw error:", err);
      // If API reports zero remaining, show the required alert
      window.alert("Error: no cards remaining!");
    } finally {
      setDrawing(false);
    }
  }

  async function handleShuffle() {
    if (!deckId) return;
    try {
      setShuffling(true);
      // shuffle existing deck_id; reset drawn list
      const data = await request(
        `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
      );
      if (!data.success) throw new Error("Shuffle failed");
      setCards([]);
      setRemaining(data.remaining); // should be 52
    } catch (err) {
      console.error("Shuffle error:", err);
      window.alert("Error shuffling deck — try again.");
    } finally {
      setShuffling(false);
    }
  }

  const disableDraw = loadingDeck || drawing || shuffling;
  const disableShuffle = loadingDeck || shuffling;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={handleDraw} disabled={disableDraw}>
          {drawing ? "Drawing..." : "Draw Card"}
        </button>
        <button onClick={handleShuffle} disabled={disableShuffle}>
          {shuffling ? "Shuffling..." : "Shuffle Deck"}
        </button>
        <span>Remaining: {remaining}</span>
      </div>

      {loadingDeck && <i>(loading deck...)</i>}

      <div
        aria-label="table"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", minHeight: 120 }}
      >
        {cards.map((c) => (
          <img
            key={c.code + "-" + cards.length}
            src={c.image}
            alt={`${c.value} of ${c.suit}`}
            width={110}
            height={160}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}