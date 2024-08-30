import themes from "./themes";
import { generateTeam } from "./generators";
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Daemon from "./characters/Daemon"
import Undead from "./characters/Undead"
import Vampire from "./characters/Vampire"

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const boxSize = 8;

    const mainTeamAllowedType = [Bowman, Swordsman, Magician];
    const opponentTeamAllowedType = [Daemon, Undead, Vampire];
    const teamCount = 2;
    const opponentCount = 2;
    const allowedLevel = 2;

    const mainTeam = generateTeam(mainTeamAllowedType, allowedLevel, teamCount);
    const opponentTeam = generateTeam(opponentTeamAllowedType, allowedLevel, teamCount);

    const generateRandomMainPosition = (howPositions) => {
      const allowedPositions = [];
      for(let i = 0; i < boxSize * boxSize - 1; i += 1) {
        if(i % boxSize === 0 || i % boxSize === 1) allowedPositions.push(i)
      }
      const randomPositions = [];
      for(let i = 0; i < howPositions; i += 1) {
        const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
        randomPositions.push(allowedPositions[num]);
        allowedPositions.splice(num, 1);
      }

      return randomPositions;
    };

    const generateRandomOpponentPosition = (howPositions) => {
      const allowedPositions = [];
      for(let i = 0; i < boxSize * boxSize - 1; i += 1) {
        if(i % boxSize === boxSize - 1 || i % boxSize === boxSize - 2) allowedPositions.push(i)
      }
      const randomPositions = [];
      for(let i = 0; i < howPositions; i += 1) {
        const num = Math.floor(Math.random() * (allowedPositions.length - 0) + 0);
        randomPositions.push(allowedPositions[num]);
        allowedPositions.splice(num, 1);
      }

      return randomPositions;
    };

    const mainPositions = generateRandomMainPosition(teamCount);
    const opponentPositions = generateRandomOpponentPosition(opponentCount);
    
    const positionsCharacters = [];

    for(let i = 0; i < teamCount; i += 1) {
      positionsCharacters.push({character: mainTeam.characters[i], position: mainPositions[i]})
    }

    for(let i = 0; i < opponentCount; i += 1) {
      positionsCharacters.push({character: opponentTeam.characters[i], position: opponentPositions[i]})
    }

    this.gamePlay.redrawPositions(positionsCharacters);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
