import { useState, useEffect } from "react";

// An on-screen keyboard for typing guesses
export default function Keyboard({ onKeyPress }) {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
  const [screenSize, setScreenSize] = useState(window.innerWidth); // Keep track of current screen size
  useEffect(() => {
    // Uses the size of the screen to know when to rearrange components
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="keyboard">
      {screenSize > 400 ? ( // Component locations for larger screens
        <>
          <div className="keyboard-row">
            {keys.slice(0, 10).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            {keys.slice(10, 19).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => onKeyPress('Enter')}>
              Enter
            </button>
            {keys.slice(19).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
            <button className="key key-large" onClick={() => onKeyPress('Backspace')}>
              ⌫
            </button>
          </div>
        </>
      ) : ( // Component locations for smaller screens
        <>
          <div className="keyboard-row">
            {keys.slice(0, 10).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            {keys.slice(10, 19).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            {keys.slice(19).map((key, i) => (
              <button key={i} className="key" onClick={() => onKeyPress(key)}>
                {key}
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => onKeyPress('Enter')}>
              Enter
            </button>
            <button className="key key-large" onClick={() => onKeyPress('Backspace')}>
              ⌫
            </button>
          </div>
        </>
      )}
    </div>
  );
};