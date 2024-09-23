// An on-screen keyboard for typing guesses
export default function Keyboard() {
  const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  // ↵←

  return (
    <div className="keyboard">
      <div className="keyboardRow">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>
      <div className="keyboardRow">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>
      <div className="keyboardRow">
        {['↵', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>
    </div>
  );
};