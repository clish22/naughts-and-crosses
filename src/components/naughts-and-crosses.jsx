// implement:
// start button
// count down timer for start of match
// count down timer for total game time
// instructions
//draw line showing winning combo before displaying win msg

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import useSound from 'use-sound';
import naught from './naught.svg';
import cross from './cross.svg';
import pop from './pop.mp3';
import './naughts-and-crosses.css';

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
  const [gameWinningMsg, setGameWinningMsg] = useState(null);
  const [gameWinningMsgShow, setGameWinningMsgShow] = useState('none');
  const [player1GameScores, setPlayer1GameScores] = useState([]);
  const [player2GameScores, setPlayer2GameScores] = useState([]);
  const [player1TotalScore, setPlayer1TotalScore] = useState(0);
  const [player2TotalScore, setPlayer2TotalScore] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(0.75);
  const [gameTimer, setGameTimer] = useState(60);
  const [totalTimer, setTotalTimer] = useState();

  const [play] = useSound(pop, {
    playbackRate,
    volume: 0.4,
  });

  function handleGameSquareUpdate(square) {
    if (gameWinningMsg) return;
    if (square.imgDisplay === 'inline') return;

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
    setPlaybackRate(playbackRate + 0.1);
    play();
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
    setPlaybackRate(0.75);
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

    function checkWin(gameScoresArr) {
      for (const winningCombo of winningGameCombos) {
        const checkWinningCombo = winningCombo.every((value) =>
          gameScoresArr.includes(value)
        );
        if (checkWinningCombo) return true;
      }
      return false;
    }

    function updateWin(winMsg) {
      const finishGameTimeout = 2000;
      setGameWinningMsg(winMsg);
      setGameWinningMsgShow();
      setTimeout(newGame, finishGameTimeout);
      setTimeout(() => setGameWinningMsg(null), finishGameTimeout);
      setTimeout(() => setGameWinningMsgShow('none'), finishGameTimeout);
    }

    if (checkWin(player1GameScores)) {
      updateWin('Player 1 Wins!');
      setPlayer1TotalScore((p) => p + 1);
    } else if (checkWin(player2GameScores)) {
      updateWin('Player 2 Wins!');
      setPlayer2TotalScore((p) => p + 1);
    } else if (player1GameScores.length + player2GameScores.length === 9) {
      updateWin('Game Tied!');
    }

    //causes bug - after game end - squares reset after a few seconds when clicked
    // the useEffect gets run each second, when the gameTimer state changes
    // if (gameTimer > 0) {
    //   setTimeout(() => setGameTimer(gameTimer - 1), 1000);
    // }

    // console.log(gameTimer);
  }, [newGame, player1GameScores, player2GameScores]);

  useEffect(() => {
    fetchGameGrid();
  }, []);

  async function fetchGameGrid() {
    const { data } = await axios.get(
      'http://localhost:5000/api/v1/naughts-and-crosses'
    );
    console.log(data);
  }


  return (
    <>
      <h1 className="text-center py-3">Naughts and Crosses</h1>
      <div className="container" style={{ width: '21em' }}>
        <div className="row justify-content-between d-flex align-items-center">
          <div className="col-4 text-center border border-secondary border-3 rounded-3 bg-light bg-opacity-75">
            <h6>Player 1</h6>
            <div>{player1TotalScore}</div>
          </div>
          <div
            onClick={handleGameReset}
            className="col-2 btn btn-warning p-0 border border-3 border-secondary rounded-3 fw-bold"
            style={{ lineHeight: 1.5 }}
          >
            Reset
          </div>
          <div className="col-4 text-center border border-secondary border-3 rounded-3 bg-light bg-opacity-75">
            <h6>Player 2</h6>
            <div>{player2TotalScore}</div>
          </div>
        </div>
        <div className="row position-relative mt-3">
          {gameSquares.map((square) => {
            return (
              <div
                className="col-4 bg-light bg-opacity-75 border border-secondary border-3 rounded-3 position-relative p-0"
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
            className="position-absolute top-50 start-50 translate-middle text-center bg-light rounded border border-dark border-3 fs-5"
            style={{
              height: '70px',
              width: '60%',
              display: gameWinningMsgShow,
            }}
          >
            <span className="align-middle" style={{ lineHeight: '60px' }}>
              {gameWinningMsg}
            </span>
          </div>
        </div>
        {/* <div>{gameTimer}</div> */}
      </div>
    </>
  );
}

export default GameGrid;
