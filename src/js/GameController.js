import themes from "./themes";
import { generateTeam, generateRandomMainPosition, generateRandomOpponentPosition } from "./generators";
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
    this.positionsCharacters = positionsCharacters

    this.gamePlay.redrawPositions(positionsCharacters);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    
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
        alert('Это враги')
      }
    } else {
      alert('Здесь никого')
    }
    // TODO: react to click
  }

  onCellEnter(index) {
    if(this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex(item => item.position === index);

      const level = this.positionsCharacters[posIndex].character.level
      const attack = this.positionsCharacters[posIndex].character.attack
      const health = this.positionsCharacters[posIndex].character.health
      const defence = this.positionsCharacters[posIndex].character.defence

      this.gamePlay.showCellTooltip(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`, index)
    }
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    if(this.gamePlay.cells[index].hasChildNodes()) this.gamePlay.hideCellTooltip(index)
    // TODO: react to mouse leave
  }
}
