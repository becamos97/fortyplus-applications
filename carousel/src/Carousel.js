
import React, { useState } from "react";
import Card from "./Card";
// import image data if needed
// import { images } from "./imageData";

function Carousel({ photos /* = images */ }) {
  const total = photos.length;
  const [currIdx, setCurrIdx] = useState(0);

  const goForward = () => setCurrIdx(i => Math.min(i + 1, total - 1));
  const goBackward = () => setCurrIdx(i => Math.max(i - 1, 0));

  const currPhoto = photos[currIdx];

   return (
    <div className="Carousel">
      {/* Only show left arrow if not on first */}
      {currIdx > 0 && (
        <i
          className="fas fa-chevron-circle-left"
          data-testid="left-arrow"
          onClick={goBackward}
          aria-label="previous"
        />
      )}

      <Card
        caption={currPhoto.caption}
        src={currPhoto.src}
        currNum={currIdx + 1}
        totalNum={total}
      />

      {/* Only show right arrow if not on last */}
      {currIdx < total - 1 && (
        <i
          className="fas fa-chevron-circle-right"
          data-testid="right-arrow"
          onClick={goForward}
          aria-label="next"
        />
      )}
    </div>
  );
}

export default Carousel;