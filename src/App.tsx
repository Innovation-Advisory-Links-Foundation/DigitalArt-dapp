import logo from "./logo.svg"
import "./App.css"
import { Button, Typography } from "@material-ui/core"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Typography variant="body1">
          Edit <code>src/App.js</code> and save to reload.
        </Typography>
        <Button
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
        >
          Learn React
        </Button>
      </header>
    </div>
  )
}

export default App
