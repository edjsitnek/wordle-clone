import { useState, useEffect } from "react";

// An on-screen keyboard for typing guesses
export default function Keyboard({ onKeyPress, keyStatuses }) {
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

  // Fills in letter keys to keyboard rows according to slice start and end parameters
  const fillLetterKeys = (start, end) => {
    return (
      keys.slice(start, end).map((key, i) => (
        <button
          key={i}
          className={`key ${keyStatuses[key] || ''}`} // Gets the key status or returns empty string
          onClick={() => onKeyPress(key)}
        >
          {key}
        </button>
      ))
    )
  };

  return (
    <div className="keyboard">
      {screenSize > 400 ? ( // Component locations for larger screens
        <>
          <div className="keyboard-row">
            {fillLetterKeys(0, 10)}
          </div>
          <div className="keyboard-row">
            {fillLetterKeys(10, 19)}
          </div>
          <div className="keyboard-row">
            <button className="key key-large" onClick={() => onKeyPress('Enter')}>
              Enter
            </button>
            {fillLetterKeys(19)}
            <button className="key key-large" onClick={() => onKeyPress('Backspace')}>
              ⌫
            </button>
          </div>
        </>
      ) : ( // Component locations for smaller screens
        <>
          <div className="keyboard-row">
            {fillLetterKeys(0, 10)}
          </div>
          <div className="keyboard-row">
            {fillLetterKeys(10, 19)}
          </div>
          <div className="keyboard-row">
            {fillLetterKeys(19)}
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