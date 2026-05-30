import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Synergy Simulator title", () => {
  render(<App />);
  const title = screen.getByText(/Synergy Simulator/i);
  expect(title).toBeInTheDocument();
});
