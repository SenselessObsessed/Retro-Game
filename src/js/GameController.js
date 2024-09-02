import themes from "./themes";
import { generateTeam, generateRandomMainPosition, generateRandomOpponentPosition, generateAllowedPositionsToGo } from "./generators";
import Bowman from "./characters/Bowman"
import Swordsman from "./characters/Swordsman"
import Magician from "./characters/Magician"
import Daemon from "./characters/Daemon"
import Undead from "./characters/Undead"
import Vampire from "./characters/Vampire"
import GamePlay from "./GamePlay";
import GameState from "./GameState";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);

    const mainTeamAllowedType = [Bowman, Swordsman, Magician];
    const opponentTeamAllowedType = [Daemon, Undead, Vampire];
    const teamCount = 2;
    const opponentCount = 2;
    const allowedLevel = 2;

    const mainTeam = generateTeam(mainTeamAllowedType, allowedLevel, teamCount);
    const opponentTeam = generateTeam(opponentTeamAllowedType, allowedLevel, teamCount);
    const mainPositions = generateRandomMainPosition(teamCount);
    const opponentPositions = generateRandomOpponentPosition(opponentCount);
    const positionsCharacters = [];
    for(let i = 0; i < teamCount; i += 1) {
      positionsCharacters.push({character: mainTeam.characters[i], position: mainPositions[i]})
    }
    for(let i = 0; i < opponentCount; i += 1) {
      positionsCharacters.push({character: opponentTeam.characters[i], position: opponentPositions[i]})
    }
    GameState.from(positionsCharacters);
    this.positionsCharacters = positionsCharacters;

    this.gamePlay.redrawPositions(positionsCharacters);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    //Choose character
    if(this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex(item => item.position === index);
      if(
        this.positionsCharacters[posIndex].character.type === 'swordsman' || 
        this.positionsCharacters[posIndex].character.type === 'bowman' ||
        this.positionsCharacters[posIndex].character.type === 'magician'
      ) {
        if(this.selectedBox) this.gamePlay.deselectCell(this.selectedBox);
        this.selectedBox = index;
        this.gamePlay.selectCell(index);
      } else {
        GamePlay.showError('Это враги');
      }
    } else {
      GamePlay.showError('Здесь никого');
    }
    //replace character
    if(this.selectedBox !== undefined) {
      const posIndex = this.positionsCharacters.findIndex(item => item.position === this.selectedBox);
      const allowedPositionsToGo = generateAllowedPositionsToGo(this.selectedBox, this.positionsCharacters[posIndex].character.type);
      const nextIndex = allowedPositionsToGo.findIndex(item => item === index);
      if(nextIndex !== -1) {
        const greenCell = this.gamePlay.cells[posIndex];
        greenCell.classList.remove('selected-green');
        greenCell.classList.remove('selected');
        this.gamePlay.deselectCell(this.selectedBox)
        this.selectedBox = index
        this.gamePlay.selectCell(index);
        this.positionsCharacters[posIndex].position = index;
        this.gamePlay.redrawPositions(this.positionsCharacters);
      }
    }
    // TODO: react to click
  }

  onCellEnter(index) {
    // TITLE
    if(this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex(item => item.position === index);
      if(
        this.positionsCharacters[posIndex].character.type === 'swordsman' || 
        this.positionsCharacters[posIndex].character.type === 'bowman' ||
        this.positionsCharacters[posIndex].character.type === 'magician'
      ) {
        this.gamePlay.setCursor('pointer');
      }

      const level = this.positionsCharacters[posIndex].character.level;
      const attack = this.positionsCharacters[posIndex].character.attack;
      const health = this.positionsCharacters[posIndex].character.health;
      const defence = this.positionsCharacters[posIndex].character.defence;

      this.gamePlay.showCellTooltip(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`, index);
    }
    //GREEN CIRCLE
    if(this.selectedBox !== undefined) {
      const posIndex = this.positionsCharacters.findIndex(item => item.position === this.selectedBox);
      if(this.positionsCharacters[posIndex]) {
        const allowAroundPerson = generateAllowedPositionsToGo(this.selectedBox, this.positionsCharacters[posIndex].character.type)
      const indexAround = allowAroundPerson.findIndex(item => item === index);
      if(indexAround !== -1 && !this.gamePlay.cells[index].hasChildNodes()) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
      }
      this.allowedPositionsToGo = allowAroundPerson;
      this.lastGreenCircle = index;
      }
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    if(this.gamePlay.cells[index].hasChildNodes()) {
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor('unset');
    }
    //REMOVE GREEN CIRCLE
    if(this.selectedBox !== undefined) {
      if(this.lastGreenCircle !== undefined) {
        const greenCell = document.querySelector('.selected-green');
        if(greenCell) {
          greenCell.classList.remove('selected-green');
          greenCell.classList.remove('selected');
        };
        this.gamePlay.setCursor('not-allowed');
      }
    }
    // TODO: react to mouse leave
  }
}
