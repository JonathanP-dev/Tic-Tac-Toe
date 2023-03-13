import { useState } from "react"
import confetti from "canvas-confetti"

import { Square } from "./components/Square"
import { TURNS, WINNER_COMBOS } from "./constants"
import { checkWinnerFrom, checkEndGame } from "./logic/board"
import { WinnerModal } from "./components/WinnerModal"

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromLocalStorage = window.localStorage.getItem('board')
    if (boardFromLocalStorage) return JSON.parse(boardFromLocalStorage)
    return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = window.localStorage.getItem('turn')
    if (turnFromLocalStorage) return turnFromLocalStorage
    return TURNS.X
  })
  const [winner, setWinner] = useState(null) // null no hay ganador, false es que hay empate

  const resetLocalStorage = () => {
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetLocalStorage()
  }

  const updateBoard = (index) => {
    // si el indice ya tiene un valor sale de la funcion
    if (board[index] || winner) return

    // actualizar tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    // revisamos si hay un ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      confetti()
      resetLocalStorage()
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
      resetLocalStorage()
    }
  }

  return (
    <main className="board">
    <h1>ta-te-ti</h1>
    <button onClick={resetGame}>Reset del juego</button>
    <section className="game">
      {
        board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          )
        })
      }
    </section>
    <section className="turn">
      <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
      <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
    </section>
    <WinnerModal resetGame={resetGame} winner={winner}/>
  </main>
  )
}

export default App
