import React, { useState, useRef } from "react";
import "./App.css";
import rock from "./assets/rock.png";
import paper from "./assets/paper.png";
import scissors from "./assets/scissors.png";
import cardBack from "./assets/card-back.png";
import confettiGif from "./assets/confetti.gif";
import rainGif from "./assets/rain.gif";

// Sound effects
import winSound from "./assets/win.mp3";
import loseSound from "./assets/lose.mp3";
import drawSound from "./assets/draw.mp3";
import playAgainSound from "./assets/playagain.mp3";
import hoverSound from "./assets/hover.mp3";
import chooseSound from "./assets/choose.mp3";
import blockSound from "./assets/block.mp3";
import flipSound from "./assets/flip.mp3";
import drumrollSound from "./assets/drumroll.mp3";

const allChoices = [
  { name: "rock", img: rock },
  { name: "paper", img: paper },
  { name: "scissors", img: scissors },
];

function App() {
  const [playerChoices, setPlayerChoices] = useState(allChoices);
  const [computerChoices, setComputerChoices] = useState(allChoices);
  const [playerCard, setPlayerCard] = useState(null);
  const [computerCard, setComputerCard] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [battleState, setBattleState] = useState("idle");
  const [isFlipped, setIsFlipped] = useState(false);

  // Audio refs
  const audioRefs = useRef({
    win: new Audio(winSound),
    lose: new Audio(loseSound),
    draw: new Audio(drawSound),
    playagain: new Audio(playAgainSound),
    hover: new Audio(hoverSound),
    choose: new Audio(chooseSound),
    block: new Audio(blockSound),
    flip: new Audio(flipSound),
    drumroll: new Audio(drumrollSound),
  });

  const safePlay = (sound) => {
    if (!sound) return;
    sound.currentTime = 0;
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  };

  const play = (choice, index) => {
    safePlay(audioRefs.current.choose);
    safePlay(audioRefs.current.drumroll);

    const compIndex = Math.floor(Math.random() * computerChoices.length);
    const computer = computerChoices[compIndex];

    setPlayerCard(choice);
    setComputerCard(computer);
    setBattleState("moving");
    setPlayerChoices((prev) => prev.filter((_, i) => i !== index));
    setComputerChoices((prev) => prev.filter((_, i) => i !== compIndex));

    setTimeout(() => {
      setBattleState("flipping");
      safePlay(audioRefs.current.flip);
      setIsFlipped(true);
    }, 1000);

    setTimeout(() => {
      let res = "";
      audioRefs.current.drumroll.pause();
      audioRefs.current.drumroll.currentTime = 0;

      if (choice.name === computer.name) {
        res = "Draw!";
        safePlay(audioRefs.current.draw);
      } else if (
        (choice.name === "rock" && computer.name === "scissors") ||
        (choice.name === "paper" && computer.name === "rock") ||
        (choice.name === "scissors" && computer.name === "paper")
      ) {
        res = "You Win!";
        safePlay(audioRefs.current.win);
        setScore((s) => ({ ...s, player: s.player + 1 }));
      } else {
        res = "Computer Wins!";
        safePlay(audioRefs.current.lose);
        setScore((s) => ({ ...s, computer: s.computer + 1 }));
      }
      setResult(res);
      setBattleState("showdown");
    }, 2000);
  };

  const reset = () => {
    safePlay(audioRefs.current.playagain);
    setPlayerCard(null);
    setComputerCard(null);
    setPlayerChoices(allChoices);
    setComputerChoices(allChoices);
    setResult("");
    setBattleState("idle");
    setIsFlipped(false);
  };

  return (
    <div className="wood-frame">
      {battleState === "showdown" && result === "You Win!" && (
        <img src={confettiGif} alt="Confetti" className="confetti-gif-full" />
      )}
      {battleState === "showdown" && result === "Computer Wins!" && (
        <img src={rainGif} alt="Rain" className="rain-gif" />
      )}

      <div className="table">
        <div className="background-title">Rock Paper Scissors</div>
        <div className="scoreboard">
          <span className="score you">You: {score.player}</span>
          <span className="score computer">Computer: {score.computer}</span>
        </div>

        <div className={`hands-container ${battleState !== "idle" ? "dimmed" : ""}`}>
          <div className="hand computer-hand">
            {computerChoices.map((_, i) => (
              <img
                key={i}
                src={cardBack}
                alt="Computer card"
                className={`card fanned-card computer-rotate${i}`}
                onMouseEnter={() => safePlay(audioRefs.current.hover)}
                onClick={() => safePlay(audioRefs.current.block)}
              />
            ))}
          </div>

          <div className="hand player-hand">
            {playerChoices.map((choice, i) => (
              <img
                key={choice.name}
                src={choice.img}
                alt={choice.name}
                className={`card fanned-card rotate${i}`}
                onMouseEnter={() => safePlay(audioRefs.current.hover)}
                onClick={() => battleState === "idle" && play(choice, i)}
              />
            ))}
          </div>
        </div>

        {playerCard && (
          <div className="battle-arena">
            <div className={`battle-card player ${battleState}`}>
              <img src={playerCard.img} alt="Player" />
              <p>You</p>
            </div>

            <div className={`battle-card computer ${isFlipped ? "flipping" : ""}`}>
              <div className="card-inner">
                <div className="card-front">
                  <img src={cardBack} alt="Back" />
                </div>
                <div className="card-back">
                  <img src={computerCard.img} alt="Computer" />
                </div>
              </div>
              <p>Computer</p>
            </div>
          </div>
        )}

        {battleState === "showdown" && (
          <div className="result">
            <h2>{result}</h2>
            <button onClick={reset}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
