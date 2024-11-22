// A modal that pops up when a game over is reached
export default function Modal({ isWin, numGuesses, solution, onClickX, onClickReset, stats }) {
  const fillStats = () => {
    return (
      <div className="stats">
        <ul>
          <li>
            <div className="statNum">{stats.gamesPlayed}</div>
            <div className="statName">Played</div>
          </li>
          <li>
            <div className="statNum">{stats.winPercentage}</div>
            <div className="statName">Win%</div>
          </li>
          <li>
            <div className="statNum">{stats.averageAttempts}</div>
            <div className="statName">Average Attempts</div>
          </li>
        </ul>
      </div>
    )
  }

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
            {fillStats()}
          </>
        ) : ( // Message if the game was lost
          <>
            <div className="title">
              <h1>Game Over!</h1>
            </div>
            <div className="body">
              <p>The correct word was {solution}</p>
            </div>
            {fillStats()}
          </>
        )}

        <div className="footer">
          <button onClick={onClickReset} className="resetButton">Start New Game</button>
        </div>
      </div>
    </div>
  );
};