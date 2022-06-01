import { useCallback, useEffect, useState } from 'react';
import naught from './310250.svg';
import cross from './311733.svg';
import Scoring from './scoring';

function GameGrid() {
  const [gameSquares, setGameSquares] = useState([
    { id: 1, value: null, imgDisplay: 'none', position: 'topLeft' },
    { id: 2, value: null, imgDisplay: 'none', position: 'topCentre' },
    { id: 3, value: null, imgDisplay: 'none', position: 'topRight' },
    { id: 4, value: null, imgDisplay: 'none', position: 'midLeft' },
    { id: 5, value: null, imgDisplay: 'none', position: 'midCentre' },
    { id: 6, value: null, imgDisplay: 'none', position: 'midRight' },
    { id: 7, value: null, imgDisplay: 'none', position: 'bottomLeft' },
    { id: 8, value: null, imgDisplay: 'none', position: 'bottomCentre' },
    { id: 9, value: null, imgDisplay: 'none', position: 'bottomRight' },
  ]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [gamePlayerTurn, setGamePlayerTurn] = useState(1);
  const [gameWinner, setGameWinner] = useState(null);

  const [player1GameScores, setPlayer1GameScores] = useState([]);
  const [player2GameScores, setPlayer2GameScores] = useState([]);

  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);

  function handleGameSquareUpdate(square) {
    if (gameWinner) return;

    if (playerTurn === 1 && !square.value) {
      square.value = naught;
      setPlayer1GameScores([...player1GameScores, square.id]);
      setPlayerTurn(2);
    }
    if (playerTurn === 2 && !square.value) {
      square.value = cross;
      setPlayer2GameScores([...player2GameScores, square.id]);
      setPlayerTurn(1);
    }
    square.imgDisplay = 'inline';
    const updatedGameSquares = [...gameSquares];
    const index = updatedGameSquares.indexOf(square);
    updatedGameSquares[index] = { ...square };
    setGameSquares(updatedGameSquares);
  }

  const handleGameReset = useCallback(() => {
    setGameSquares([
      { id: 1, value: null, imgDisplay: 'none', position: 'topLeft' },
      { id: 2, value: null, imgDisplay: 'none', position: 'topCentre' },
      { id: 3, value: null, imgDisplay: 'none', position: 'topRight' },
      { id: 4, value: null, imgDisplay: 'none', position: 'midLeft' },
      { id: 5, value: null, imgDisplay: 'none', position: 'midCentre' },
      { id: 6, value: null, imgDisplay: 'none', position: 'midRight' },
      { id: 7, value: null, imgDisplay: 'none', position: 'bottomLeft' },
      { id: 8, value: null, imgDisplay: 'none', position: 'bottomCentre' },
      { id: 9, value: null, imgDisplay: 'none', position: 'bottomRight' },
    ]);

    if (gamePlayerTurn === 1) {
      setGamePlayerTurn(2);
      setPlayerTurn(2);
    } else {
      setGamePlayerTurn(1);
      setPlayerTurn(1);
    }

    setPlayer1GameScores([]);
    setPlayer2GameScores([]);
  }, [gamePlayerTurn]);

  useEffect(() => {
    const winningGameCombos = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    for (let i = 0; i < winningGameCombos.length; i++) {
      if (
        player1GameScores.includes(winningGameCombos[i][0]) &&
        player1GameScores.includes(winningGameCombos[i][1]) &&
        player1GameScores.includes(winningGameCombos[i][2])
      ) {
        setPlayer1TotalScore((p) => p + 1);
        setGameWinner('Player 1');
        console.log(gameWinner);
        setTimeout(handleGameReset, 2000);
        setTimeout(() => setGameWinner(null), 2000);
        setTimeout(() => console.log(gameWinner), 2100);
      }

      if (
        player2GameScores.includes(winningGameCombos[i][0]) &&
        player2GameScores.includes(winningGameCombos[i][1]) &&
        player2GameScores.includes(winningGameCombos[i][2])
      ) {
        setPlayer2TotalScore((p) => p + 1);
        setGameWinner('Player 2');
        // console.log(gameWinner);
        setTimeout(handleGameReset, 2500);
        setTimeout(() => setGameWinner(null), 2000);
        // setTimeout(() => console.log(gameWinner), 2100);
      }
    }
  }, [handleGameReset, player1GameScores, player2GameScores, gameWinner]);

  return (
    <div className="container" style={{ width: '24em' }}>
      <h4 className="text-center">Player {playerTurn} Turn</h4>
      <h3>Winner: {gameWinner} </h3>
      <div className="row">
        {gameSquares.map((square) => {
          return (
            <div
              className="col-4 border rounded border-dark position-relative"
              style={{ height: '8em' }}
              key={square.id}
              onClick={() => handleGameSquareUpdate(square)}
            >
              <img
                src={square.value}
                alt="Naughts and Crosses Symbol"
                className="position-absolute top-50 start-50 translate-middle"
                style={{
                  height: '75px',
                  width: '75px',
                  display: square.imgDisplay,
                }}
              />
            </div>
          );
        })}
      </div>

      <Scoring
        player1TotalScore={player1TotalScore}
        player2TotalScore={player2TotalScore}
      />
    </div>
  );
}

export default GameGrid;
