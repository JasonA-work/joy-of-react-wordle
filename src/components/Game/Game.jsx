import React from 'react';

import { sample, range } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers'

import { NUM_OF_GUESSES_ALLOWED } from '../../constants'

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {

  const [value, setValue] = React.useState('')
  const [guessList, setGuessList] = React.useState([])
  const [attempts, setAttempts] = React.useState(0)
  const [gameStatus, setGameStatus] = React.useState('')

  const NUM_OF_LETTERS = 5

  const Columns = ({ guess }) => {
    return (
      <>
        {
          range(NUM_OF_LETTERS).map((item, i) => {
            return (
              <span key={Math.random()} className={`cell ${guess ? guess[i].status : ""}`}>{guess ? guess[i].letter : ''}</span>
            )
          })
        }
      </>
    )
  }

  const Grid = () => {
    return (
      <>
        {
          range(NUM_OF_GUESSES_ALLOWED).map((item, i) => {
            return (
              <p key={Math.random()} className="guess">
                <Columns guess={guessList.length > 0 ? guessList[i] : null} />
              </p>
            )
          })
        }
      </>
    )
  }

  function handleOnChange(e) {
    setValue(e.target.value.toUpperCase())
  }

  function handleSubmit(e) {
    e.preventDefault()

    setAttempts(prev => prev + 1)

    let result = checkGuess(value, answer)
    setGuessList(prev => [...prev, result])
    setValue('')

    if (value === answer) {
      setGameStatus('happy')
    }

    if (attempts === NUM_OF_GUESSES_ALLOWED - 1) {
      setGameStatus('sad')
    }
  }

  const HappyBanner = () => {
    return (
      <div className="happy banner">
        <p>
          <strong>Congratulations!</strong> Got it in
          <strong>{attempts} guesses</strong>.
        </p>
      </div>
    )
  }

  const SadBanner = () => {
    return (
      <div className="sad banner">
        <p>Sorry, the correct answer is <strong>{answer}</strong>.</p>
      </div>
    )
  }

  return (
    <>
      <form className="guess-input-wrapper" onSubmit={handleSubmit}>
        <label htmlFor="guessInput">Enter value:</label>
        <input
          id="guessInput"
          type="text"
          required
          minLength={5}
          maxLength={5}
          value={value}
          onChange={handleOnChange}
          pattern="^[a-zA-Z]{5}$"
          disabled={gameStatus === '' ? false : true}
        />
      </form>
      <div className="guess-results">
        <Grid />
      </div>
      {
        gameStatus === "happy" ? <HappyBanner /> : null
      }
      {
        gameStatus === "sad" ? <SadBanner /> : null
      }

    </>
  )
}

export default Game;
