import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Carousel from "./Carousel";
import TEST_IMAGES from "./_testCommon.js";

// helper: find right arrow by data-testid or common classes
function getRightArrow(container) {
  return (
    container.querySelector('[data-testid="right-arrow"]') ||
    container.querySelector(".bi-arrow-right-circle") ||
    container.querySelector(".bi-arrow-right-circle-fill") ||
    container.querySelector(".right-arrow") ||
    null
  );
}

// helper: find left arrow by data-testid or common classes
function getLeftArrow(container) {
  return (
    container.querySelector('[data-testid="left-arrow"]') ||
    container.querySelector(".bi-arrow-left-circle") ||
    container.querySelector(".bi-arrow-left-circle-fill") ||
    container.querySelector(".left-arrow") ||
    null
  );
}

describe("Carousel", () => {
  // Smoke
  it("renders without crashing", () => {
    render(<Carousel photos={TEST_IMAGES} title="images for testing" />);
  });

  // Snapshot
  it("matches snapshot", () => {
    const { asFragment } = render(
      <Carousel photos={TEST_IMAGES} title="images for testing" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  // Demo test (right arrow moves forward)
  it("works when you click on the right arrow", function () {
    const { container } = render(
      <Carousel photos={TEST_IMAGES} title="images for testing" />
    );
    expect(container.querySelector('img[alt="testing image 1"]')).toBeInTheDocument();
    expect(container.querySelector('img[alt="testing image 2"]')).not.toBeInTheDocument();

    const rightArrow = getRightArrow(container);
    expect(rightArrow).toBeTruthy(); // ensure we found it
    fireEvent.click(rightArrow);

    expect(container.querySelector('img[alt="testing image 1"]')).not.toBeInTheDocument();
    expect(container.querySelector('img[alt="testing image 2"]')).toBeInTheDocument();
  });

  // Part 3: left arrow should go BACK
  it("moves backward when left arrow is clicked (from second image)", () => {
    const { container } = render(
      <Carousel photos={TEST_IMAGES} title="images for testing" />
    );

    // go to second image
    const rightArrow = getRightArrow(container);
    expect(rightArrow).toBeTruthy();
    fireEvent.click(rightArrow);

    expect(container.querySelector('img[alt="testing image 2"]')).toBeInTheDocument();

    const leftArrow = getLeftArrow(container);
    expect(leftArrow).toBeTruthy();
    fireEvent.click(leftArrow);

    expect(container.querySelector('img[alt="testing image 1"]')).toBeInTheDocument();
    expect(container.querySelector('img[alt="testing image 2"]')).not.toBeInTheDocument();
  });

  // Part 4: hide left on first, hide right on last
  it("hides left arrow on first image and right arrow on last image", () => {
    const { container } = render(
      <Carousel photos={TEST_IMAGES} title="images for testing" />
    );

    // On first image: left arrow should be ABSENT
    expect(getLeftArrow(container)).toBeNull();

    // Click right until right arrow disappears (now at last image)
    let right = getRightArrow(container);
    // right should exist initially; if not, fail fast:
    expect(right).toBeTruthy();
    while (right) {
      fireEvent.click(right);
      right = getRightArrow(container);
    }

    // Now on last image: right arrow should be ABSENT
    expect(getRightArrow(container)).toBeNull();

  });
});