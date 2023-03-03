import { useReducer } from "react";

export interface Board {
  mines: boolean[][];
  flags: boolean[][];
  revealed: boolean[][];
  height: number;
  width: number;
}

interface GameState {
  boards: [Board, Board];
}

type GameAction =
  | {
      type: "placeMine";
      boardNumber: 0 | 1;
      row: number;
      column: number;
    }
  | {
      type: "placeFlag";
      boardNumber: 0 | 1;
      row: number;
      column: number;
    }
  | {
      type: "revealCell";
      boardNumber: 0 | 1;
      row: number;
      column: number;
    };

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "placeMine": {
      const board = state.boards[action.boardNumber];
      const newBoard = placeMine(board, action.row, action.column);

      return {
        ...state,
        boards: [
          action.boardNumber === 0 ? newBoard : state.boards[0],
          action.boardNumber === 1 ? newBoard : state.boards[1],
        ],
      };
    }
    case "placeFlag": {
      const board = state.boards[action.boardNumber];
      const newBoard = placeFlag(board, action.row, action.column);

      return {
        ...state,
        boards: [
          action.boardNumber === 0 ? newBoard : state.boards[0],
          action.boardNumber === 1 ? newBoard : state.boards[1],
        ],
      };
    }
    case "revealCell": {
      const board = state.boards[action.boardNumber];
      const newBoard = revealCell(board, action.row, action.column);

      return {
        ...state,
        boards: [
          action.boardNumber === 0 ? newBoard : state.boards[0],
          action.boardNumber === 1 ? newBoard : state.boards[1],
        ],
      };
    }
  }
}

function getBlankBoard(height: number, width: number): Board {
  const mines = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));
  const flags = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));
  const revealed = new Array(height)
    .fill(null)
    .map(() => new Array(width).fill(false));

  return { mines, revealed, flags, height, width };
}

interface GetInitialStateOptions {
  width: number;
  height: number;
}

function getInitialState({ width, height }: GetInitialStateOptions): GameState {
  return {
    boards: [getBlankBoard(width, height), getBlankBoard(width, height)],
  };
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(
    reducer,
    { width: 10, height: 10 },
    getInitialState
  );

  return [state, dispatch] as const;
}

export function getBoardNumbers(board: Board) {
  const numbers = new Array(board.height)
    .fill(null)
    .map(() => new Array(board.width).fill(0));

  for (let i = 0; i < board.height; i++) {
    for (let j = 0; j < board.width; j++) {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (board.mines[i + x]?.[j + y]) {
            numbers[i][j]++;
          }
        }
      }
    }
  }

  return numbers;
}

function placeMine(
  board: Board,
  rowNumber: number,
  columnNumber: number
): Board {
  return {
    ...board,
    mines: board.mines.map((row, i) =>
      row.map((mine, j) => {
        if (i === rowNumber && j === columnNumber) {
          return true;
        }

        return mine;
      })
    ),
  };
}

function placeFlag(
  board: Board,
  rowNumber: number,
  columnNumber: number
): Board {
  return {
    ...board,
    flags: board.flags.map((row, i) =>
      row.map((flag, j) => {
        if (i === rowNumber && j === columnNumber) {
          return true;
        }

        return flag;
      })
    ),
  };
}

function revealCell(
  board: Board,
  rowNumber: number,
  columnNumber: number
): Board {
  let newRevealed = board.revealed.map((row) => row.map((cell) => cell));
  let numbers = getBoardNumbers(board);

  function reveal(row: number, column: number) {
    if (newRevealed[row]?.[column]) {
      return;
    }

    if (row < 0 || row >= board.height || column < 0 || column >= board.width) {
      return;
    }

    newRevealed[row][column] = true;

    // if (numbers[row][column] === 0) {
    //   for (let x = -1; x <= 1; x++) {
    //     for (let y = -1; y <= 1; y++) {
    //       reveal(row + x, column + y);
    //     }
    //   }
    // }
  }

  reveal(rowNumber, columnNumber);

  return {
    ...board,
    revealed: newRevealed,
  };
}
