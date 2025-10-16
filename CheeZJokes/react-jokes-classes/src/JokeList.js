import React, { useEffect, useState, useCallback } from "react";
import Joke from "./Joke";

/**
 * JokeList (hooks version, Option A):
 * - Shows spinner until 5 unique jokes are loaded
 * - Fetches jokes from ICanHazDadJoke
 * - Renders list with up/down voting
 * - "Get 5 New Jokes" loads a fresh batch WITHOUT clearing first
 */

const API_URL = "https://icanhazdadjoke.com/";
const TARGET_COUNT = 5;

export default function JokeList() {
  const [jokes, setJokes] = useState([]); // [{ id, text, votes }]
  const [loading, setLoading] = useState(true);

  const fetchOneJoke = useCallback(async () => {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("Network error fetching joke");
    const data = await res.json(); // { id, joke }
    return { id: data.id, text: data.joke };
  }, []);

  // Build a fresh batch of 5 unique jokes and only then replace state
  const loadJokes = useCallback(async () => {
    setLoading(true);
    try {
      const next = [];
      const localSeen = new Set(); // de-dupe within this batch only

      let attempts = 0;
      const MAX_ATTEMPTS = 60; // generous safety cap

      while (next.length < TARGET_COUNT && attempts < MAX_ATTEMPTS) {
        attempts++;
        const j = await fetchOneJoke();
        if (!localSeen.has(j.id)) {
          localSeen.add(j.id);
          next.push({ ...j, votes: 0 });
        }
      }

      if (next.length < TARGET_COUNT) {
        throw new Error("Could not fetch enough unique jokes");
      }

      setJokes(next); // replace AFTER success
    } catch (err) {
      console.error(err);
      // leave existing jokes as-is if the refresh fails
    } finally {
      setLoading(false);
    }
  }, [fetchOneJoke]);

  useEffect(() => {
    loadJokes(); // initial load
  }, [loadJokes]);

  const vote = useCallback((id, delta) => {
    setJokes(curr =>
      curr.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }, []);

  const handleMoreJokes = useCallback(() => {
    // Do NOT clear first — spinner shows while we fetch, then swap in the new batch
    loadJokes();
  }, [loadJokes]);

  if (loading && jokes.length === 0) {
    return (
      <div style={styles.centerWrap}>
        <div id="spinKey" style={styles.spinner} aria-label="Loading jokes…" />
        <div>Loading jokes…</div>
      </div>
    );
  }

  // Fallback UI: if not loading and nothing to show (rare error case)
  if (!loading && jokes.length === 0) {
    return (
      <div style={styles.centerWrap}>
        <p>Couldn’t load jokes. Wanna try again?</p>
        <button onClick={handleMoreJokes} style={styles.refreshBtn}>Try Again</button>
      </div>
    );
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Dad Jokes</h1>
        <button onClick={handleMoreJokes} style={styles.refreshBtn}>
          Get 5 New Jokes
        </button>
      </header>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={styles.smallSpinner} aria-hidden />
          <span>Refreshing…</span>
        </div>
      )}

      <ul style={styles.list}>
        {jokes.map(j => (
          <li key={j.id} style={styles.item}>
            <Joke
              id={j.id}
              text={j.text}
              votes={j.votes}
              onUp={() => vote(j.id, +1)}
              onDown={() => vote(j.id, -1)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}

const styles = {
  container: { maxWidth: 700, margin: "32px auto", padding: "0 16px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  refreshBtn: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
    background: "#f7f7f7"
  },
  list: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 },
  item: { border: "1px solid #eee", borderRadius: 10, padding: 12 },
  centerWrap: {
    minHeight: "50vh",
    display: "grid",
    placeItems: "center",
    gap: 12
  },
  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #eee",
    borderTopColor: "#666",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite"
  },
  smallSpinner: {
    width: 18,
    height: 18,
    border: "3px solid #eee",
    borderTopColor: "#666",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite"
  }
};

// Inject spinner keyframes once
(() => {
  const id = "joke-spinner-keyframes";
  if (!document.getElementById(id)) {
    const styleTag = document.createElement("style");
    styleTag.id = id;
    styleTag.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleTag);
  }
})();