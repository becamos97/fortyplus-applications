import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

// Smoke test
it("renders without crashing", () => {
  render(
    <Card
      caption="Test Caption"
      src="/fake.jpg"
      currNum={1}
      totalNum={5}
    />
  );
});

// Snapshot test
it("matches snapshot", () => {
  const { asFragment } = render(
    <Card
      caption="Test Caption"
      src="/fake.jpg"
      currNum={1}
      totalNum={5}
    />
  );
  expect(asFragment()).toMatchSnapshot();
});

// (Nice extra) Checks expected UI text that Card is known to show:
it("shows caption and image count", () => {
  render(
    <Card
      caption="Test Caption"
      src="/fake.jpg"
      currNum={1}
      totalNum={5}
    />
  );
  expect(screen.getByText("Test Caption")).toBeInTheDocument();
  expect(screen.getByText(/Image 1 of 5/i)).toBeInTheDocument();
});