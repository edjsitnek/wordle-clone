// A modal that pops up when a game over is reached
export default function Modal({ isWin, numGuesses, solution, onClickX, onClickReset }) {
  return (
    // Clicking on the background will close modal
    <div className="modalBackground" onClick={() => onClickX(false)}>
      <div className="modalContainer" onClick={e => e.stopPropagation()}>
        <div className="closeButton">
          <button onClick={() => onClickX(false)}>X</button>
        </div>
        {isWin ? ( // Message if the game was won
          <>
            <div className="title">
              <h1>You won!</h1>
            </div>
            <div className="body">
              {(numGuesses === 1) ? (
                <p>You guessed the correct word in 1 attempt!</p>
              ) : (
                <p>You guessed the correct word in {numGuesses} attempts!</p>
              )}
            </div>
          </>
        ) : ( // Message if the game was lost
          <>
            <div className="title">
              <h1>Game Over!</h1>
            </div>
            <div className="body">
              <p>The correct word was {solution}</p>
            </div>
          </>
        )}

        <div className="footer">
          <button onClick={onClickReset} className="resetButton">Start New Game</button>
        </div>
      </div>
    </div>
  );
};