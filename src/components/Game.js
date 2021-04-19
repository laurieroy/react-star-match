import React, { useEffect, useState } from 'react';
import PlayAgain from './PlayAgain';
import PlayNumber from './PlayNumber';
import StarsDisplay from './StarsDisplay';

import utils from '../math-utils';

const useGameState = () => {
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNumbers, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNumbers, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
  
  useEffect (() => {
    if (secondsLeft > 0 && availableNumbers.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
  const setGameState = (newCandidateNumbers) => {
    if (utils.sum(newCandidateNumbers) !== stars) {
      setCandidateNums(newCandidateNumbers);
    } else {
      const newAvailableNums = availableNumbers.filter(
        n => !newCandidateNumbers.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  return { stars, availableNumbers, candidateNumbers, secondsLeft, setGameState };
};

const Game = (props) => {
  const {
    stars,
    availableNumbers,
    candidateNumbers,
    secondsLeft,
    setGameState,
  } = useGameState();

  const candidatesAreWrong = utils.sum(candidateNumbers) > stars;

  const gameStatus = availableNumbers.length === 0 
    ? 'won' 
    : availableNumbers.length === 0 ? 'lost' : 'active';

  const numberStatus = (number) => {
    if (!availableNumbers.includes(number)) {
      return 'used';
    }
    if (candidateNumbers.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus == 'used') {
      return;
    }
    const newCandidateNumbers = 
      currentStatus === 'avaialble' 
      ? candidateNumbers.concat(number) 
      : candidateNumbers.filter(cn => cn !== number );

    setGameState(newCandidateNumbers);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus} />
          ) : (
            <StarsDisplay count={stars} />
          )} 
        </div>

        <div className="right">
          {utils.range(1, 9).map(number =>
            <PlayNumber
              key={number} 
              status={numberStatus(number)}              
              number={number} 
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

export default Game;