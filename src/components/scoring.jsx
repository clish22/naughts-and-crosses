import React from 'react';

function Scoring(props) {
  return (
    <>
      <div className="container mt-4">
        <h4 className="text-center">Scoring</h4>
        <div className="row">
          <div className="col-6 border rounded border-dark">
            Player 1: {props.player1TotalScore}
          </div>
          <div className="col-6 border rounded border-dark">
            Player 2: {props.player2TotalScore}
          </div>
        </div>
      </div>
      <button onClick={props.onGameReset} className="btn btn-warning btn-sm">
        Reset Scores
      </button>
    </>
  );
}

export default Scoring;
