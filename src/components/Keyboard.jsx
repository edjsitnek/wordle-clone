// An on-screen keyboard for typing guesses
export default function Keyboard() {
  const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  // ↵←

  return (
    <div className="keyboard">
      <div className="row1">
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>
      <div className="row2">
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>
      <div className="row3">
        {['↵', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
          .map((keyValue, i) => (
            <button className="key" key={i}>
              {keyValue}
            </button>
          ))}
      </div>



      {/* {keys.map((key, i) => (
        <button className="key" key={i}>
          {key}
        </button>
      ))} */}
    </div>
  );
};