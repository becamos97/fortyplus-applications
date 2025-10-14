
import React from "react";
import backOfCard from "./back.png";
import { useFlip } from "./hooks";

function PlayingCard({ front }) {
  const [isFacingUp, flip] = useFlip(true);
  return (
    <img
      src={isFacingUp ? front : backOfCard}
      alt="playing card"
      onClick={flip}
      style={{ width: 120, cursor: "pointer" }}
    />
  );
}
export default PlayingCard;