import { useCallback, useEffect, useState } from 'react';
import naught from './310250.svg';
import cross from './311733.svg';

//bugs:
//when game ends on tie - still adds points to players total score (noticed with player 1)
//when game ends on 9th square being click - game says "tie" even though a player won

function GameGrid() {
  // change imgDiplsya to a {styles} object/property
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
  const [gameWinningMsg, setGameWinningMsg] = useState(null);

  const [gameWinningMsgShow, setGameWinningMsgShow] = useState('none');

  // refactor: game scores into one array
  const [player1GameScores, setPlayer1GameScores] = useState([]);
  const [player2GameScores, setPlayer2GameScores] = useState([]);

  //refactor: total scores into one array
  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);

  function handleGameSquareUpdate(square) {
    if (gameWinningMsg) return;

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

  const newGame = useCallback(() => {
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

  function handleGameReset() {
    newGame();
    setPlayer1TotalScore(0);
    setPlayer2TotalScore(0);
  }

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

    const finishGameTimeout = 2000;

    //create a function that handles the true/false if arguments
    //accepts different parameters
    for (let i = 0; i < winningGameCombos.length; i++) {
      if (
        player1GameScores.includes(winningGameCombos[i][0]) &&
        player1GameScores.includes(winningGameCombos[i][1]) &&
        player1GameScores.includes(winningGameCombos[i][2])
      ) {
        setPlayer1TotalScore((p) => p + 1);
        setGameWinningMsg('Player 1 Wins!');
        setGameWinningMsgShow();
        setTimeout(newGame, finishGameTimeout);
        setTimeout(() => setGameWinningMsg(null), finishGameTimeout);
        setTimeout(() => setGameWinningMsgShow('none'), finishGameTimeout);
      } else if (
        player2GameScores.includes(winningGameCombos[i][0]) &&
        player2GameScores.includes(winningGameCombos[i][1]) &&
        player2GameScores.includes(winningGameCombos[i][2])
      ) {
        setPlayer2TotalScore((p) => p + 1);
        setGameWinningMsg('Player 2 Wins!');
        setGameWinningMsgShow('inline');
        setTimeout(newGame, finishGameTimeout);
        setTimeout(() => setGameWinningMsg(null), finishGameTimeout);
        setTimeout(() => setGameWinningMsgShow('none'), finishGameTimeout);
      } else if (player1GameScores.length + player2GameScores.length === 9) {
        setGameWinningMsg('Game Tied!');
        setGameWinningMsgShow('inline');
        setTimeout(newGame, finishGameTimeout);
        setTimeout(() => setGameWinningMsg(null), finishGameTimeout);
        setTimeout(() => setGameWinningMsgShow('none'), finishGameTimeout);
      }
    }
  }, [newGame, player1GameScores, player2GameScores]);

  //h4 that displays player turn:  display at the start of the game, then set display to none?
  // or remove once game starts
  return (
    <div className="container" style={{ width: '21em' }}>
      <div className="row">
        <div className="col-5 text-start border">
          <h6>P1</h6>
          <div>{player1TotalScore}</div>
        </div>
        <div
          onClick={handleGameReset}
          className="col-2 text-center btn btn-danger align-middle p-0 border"
        >
          Reset
        </div>
        <div className="col-5 text-end border">
          <h6>P2</h6>
          <div>{player2TotalScore}</div>
        </div>
      </div>
      {/* <h4 className="text-center">Take your turn, Player {playerTurn}</h4> */}
      <div className="row position-relative py-3">
        {gameSquares.map((square) => {
          return (
            <div
              className="col-4 border border-dark position-relative"
              style={{ height: '7em' }}
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
        <div
          className="position-absolute top-50 start-50 translate-middle text-center bg-light rounded border border-dark"
          style={{
            height: '60px',
            width: '60%',
            display: gameWinningMsgShow,
          }}
        >
          <span className="align-middle" style={{ lineHeight: '60px' }}>
            {gameWinningMsg}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GameGrid;
