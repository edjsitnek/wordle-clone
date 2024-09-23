import './App.css'
import Grid from './components/Grid'
import Keyboard from './components/Keyboard'

export default function App() {
  return (
    <>
      <div className="gameContainer">
        <Grid />
        <Keyboard />
      </div>
    </>
  )
}
