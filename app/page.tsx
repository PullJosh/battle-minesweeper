"use client";

import { Board } from "../components/Board";
import { useGameLogic } from "../gameLogic";

export default function Page() {
  const [state, dispatch] = useGameLogic();

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: "1 0 auto", padding: 20 }}>
        <h1 style={{ marginTop: 0 }}>Player 1</h1>
        <h2>My board</h2>
        <Board
          view="mine"
          board={state.boards[0]}
          onClickCell={(row, column) => {
            dispatch({ type: "revealCell", boardNumber: 0, row, column });
          }}
          onAlternateClickCell={(row, column) => {
            dispatch({ type: "placeFlag", boardNumber: 0, row, column });
          }}
        />

        <h2>Opponent's board</h2>
        <Board
          view="opponent"
          board={state.boards[1]}
          onClickCell={(row, column) => {
            dispatch({ type: "placeMine", boardNumber: 1, row, column });
          }}
        />
      </div>
      <div
        style={{
          flex: "1 0 auto",
          padding: 20,
          background: "black",
          color: "white",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Player 2</h1>
        <h2>My board</h2>
        <Board
          view="mine"
          board={state.boards[1]}
          onClickCell={(row, column) => {
            dispatch({ type: "revealCell", boardNumber: 1, row, column });
          }}
          onAlternateClickCell={(row, column) => {
            dispatch({ type: "placeFlag", boardNumber: 1, row, column });
          }}
        />

        <h2>Opponent's board</h2>
        <Board
          view="opponent"
          board={state.boards[0]}
          onClickCell={(row, column) => {
            dispatch({ type: "placeMine", boardNumber: 0, row, column });
          }}
        />
      </div>
    </div>
  );
}
