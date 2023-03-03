"use client";

import { useCallback, useEffect, useRef } from "react";
import { Board as BoardData, getBoardNumbers } from "../gameLogic";

interface BoardProps {
  view: "mine" | "opponent";
  board: BoardData;
  onClickCell?: (row: number, column: number) => void;
  onAlternateClickCell?: (row: number, column: number) => void;
}

export function Board({
  view,
  board,
  onClickCell,
  onAlternateClickCell,
}: BoardProps) {
  const numbers = getBoardNumbers(board);

  return (
    <div
      style={{
        display: "inline-grid",
        gridTemplateColumns: `repeat(${board.width}, auto)`,
        gridTemplateRows: `repeat(${board.height}, auto)`,
        gap: 1,
        padding: 1,
        background: "black",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {numbers.flatMap((row, i) =>
        row.map((cell, j) => {
          const hasFlag = board.flags[i][j];
          const hasMine = board.mines[i][j];
          const isRevealed = board.revealed[i][j];

          return (
            <Cell
              key={`${i}-${j}`}
              hasFlag={hasFlag}
              hasMine={hasMine}
              isRevealed={isRevealed}
              number={cell}
              view={view}
              onClick={() => {
                onClickCell?.(i, j);
              }}
              onAlternateClick={
                onAlternateClickCell
                  ? () => {
                      onAlternateClickCell?.(i, j);
                    }
                  : undefined
              }
            />
          );
        })
      )}
    </div>
  );
}

interface CellProps {
  hasFlag: boolean;
  hasMine: boolean;
  isRevealed: boolean;
  number: number;
  view: "mine" | "opponent";

  onClick?: () => void;
  onAlternateClick?: () => void;
}

function Cell({
  hasFlag,
  hasMine,
  isRevealed,
  number,
  view,
  onClick,
  onAlternateClick,
}: CellProps) {
  const timeoutRef = useRef<any>(null);
  const alernateClickRef = useRef<any>(null);

  useEffect(() => {
    alernateClickRef.current = onAlternateClick;
  }, [onAlternateClick]);

  const onMouseDown = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      alernateClickRef.current?.();
      timeoutRef.current = null;
    }, 400);
  }, [timeoutRef, alernateClickRef]);

  const onMouseUp = useCallback(() => {
    if (timeoutRef.current) {
      onClick?.();
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [timeoutRef]);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseUp]);

  return (
    <button
      style={{
        width: 32,
        height: 32,
        background: isRevealed ? "white" : "lightgray",
        border: "none",
        padding: 0,
        textAlign: "center",
        verticalAlign: "middle",
        fontSize: 24,
        userSelect: "none",
        color: hasMine ? "red" : "black",
      }}
      onTouchStart={onMouseDown}
      onMouseDown={onMouseDown}
    >
      {hasFlag ? (
        <div style={{ color: "red", fontSize: 18, userSelect: "none" }}>
          flag
        </div>
      ) : (
        (isRevealed || view === "opponent") &&
        (hasMine ? (
          <div
            style={{
              width: 24,
              height: 24,
              background: "red",
              borderRadius: 9999,
            }}
          />
        ) : (
          number !== 0 && <span style={{ userSelect: "none" }}>{number}</span>
        ))
      )}
    </button>
  );
}
