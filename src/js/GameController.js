import themes from './themes';
import {
  generateTeam, generateRandomMainPosition, generateRandomOpponentPosition, generateAllowedPositionsToGo, generateAllowedPositionsToAttack,
} from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.ui = 'prairie';
    this.scores = 0;
    this.dangeLevel = 1;

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
    for (let i = 0; i < teamCount; i += 1) {
      positionsCharacters.push({ character: mainTeam.characters[i], position: mainPositions[i] });
    }
    for (let i = 0; i < opponentCount; i += 1) {
      positionsCharacters.push({ character: opponentTeam.characters[i], position: opponentPositions[i] });
    }
    this.positionsCharacters = positionsCharacters;

    this.gamePlay.redrawPositions(positionsCharacters);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  newGame() {
    if (window.localStorage.getItem('state')) {
      window.localStorage.removeItem('state');
    }
    this.gamePlay.drawUi(themes.prairie);
    this.ui = 'prairie';
    this.scores = 0;
    this.dangeLevel = 1;

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
    for (let i = 0; i < teamCount; i += 1) {
      positionsCharacters.push({ character: mainTeam.characters[i], position: mainPositions[i] });
    }
    for (let i = 0; i < opponentCount; i += 1) {
      positionsCharacters.push({ character: opponentTeam.characters[i], position: opponentPositions[i] });
    }
    this.positionsCharacters = positionsCharacters;

    this.gamePlay.redrawPositions(positionsCharacters);
  }

  saveGame() {
    GameState.from([this.positionsCharacters, this.selectedBox, this.ui, this.scores]);
  }

  loadGame() {
    try {
      const state = JSON.parse(window.localStorage.getItem('state'));
      this.gamePlay.drawUi(themes[state[2]]);
      this.positionsCharacters = state[0];
      this.selectedBox = state[1];
      this.scores = state[3];
      this.gamePlay.redrawPositions(this.positionsCharacters);
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  botDoAnyThing() {
    const opponentTeamChoose = this.positionsCharacters.filter((item) => item.character.type === 'daemon' || item.character.type === 'undead' || item.character.type === 'vampire');
    const mainTeamChoose = this.positionsCharacters.filter((item) => item.character.type === 'swordsman' || item.character.type === 'bowman' || item.character.type === 'magician');
    const randomNum = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
    const randomIndex = randomNum(0, opponentTeamChoose.length - 1);
    const allowOpponentPositionToAttack = generateAllowedPositionsToAttack(opponentTeamChoose[randomIndex].position, opponentTeamChoose[randomIndex].character.type);
    const allowOpponentPositionToGo = generateAllowedPositionsToGo(opponentTeamChoose[randomIndex].position, opponentTeamChoose[randomIndex].character.type);
    let target = false;
    const attacker = opponentTeamChoose[randomIndex].character;
    allowOpponentPositionToAttack.forEach((item) => {
      for (let i = 0; i < mainTeamChoose.length; i += 1) {
        if (item === mainTeamChoose[i].position) {
          target = mainTeamChoose[i];
        }
      }
    });
    if (target) {
      const attack = Math.max(attacker.attack - target.character.defence, attacker.attack * 0.1);
      this.gamePlay.showDamage(target.position, attack)
        .then((item) => {
          target.character.health -= attack;
          if (target.character.health <= 0) {
            this.selectedBox = undefined;
            const allSelected = Array.from(document.querySelectorAll('.selected'));
            allSelected.forEach((item) => {
              item.classList.remove('selected');
              item.classList.remove('selected-yellow');
            });
            this.gamePlay.setCursor('unset');
            this.positionsCharacters = this.positionsCharacters.filter((item) => item.character.health >= 0);
            const idxMain = this.positionsCharacters.findIndex((item) => item.character.type === 'swordsman' || item.character.type === 'bowman' || item.character.type === 'magician');
            if (idxMain === -1) {
              this.newGame();
            }
          }
          this.gamePlay.redrawPositions(this.positionsCharacters);
        });
    } else {
      const randomPos = randomNum(0, allowOpponentPositionToGo.length);
      if (this.gamePlay.cells[allowOpponentPositionToGo[randomPos]]) {
        if (!this.gamePlay.cells[allowOpponentPositionToGo[randomPos]].hasChildNodes()) { opponentTeamChoose[randomIndex].position = allowOpponentPositionToGo[randomPos]; }
        this.gamePlay.redrawPositions([...mainTeamChoose, ...opponentTeamChoose]);
      }
    }
  }

  nextLevel() {
    this.positionsCharacters.forEach((element) => {
      element.character.levelUp();
    });
    switch (this.ui) {
      case 'prairie':
        this.gamePlay.drawUi(themes.desert);
        this.ui = 'desert';
        break;
      case 'desert':
        this.gamePlay.drawUi(themes.arctic);
        this.ui = 'arctic';
        break;
      case 'arctic':
        this.gamePlay.drawUi(themes.mountain);
        this.ui = 'mountain';
        break;
    }
    const mainTeamAllowedType = [Bowman, Swordsman, Magician];
    const opponentTeamAllowedType = [Daemon, Undead, Vampire];
    switch (this.dangeLevel) {
      case 1:
        this.dangeLevel = 2;
        const newMainCharsPositionsLevelTwo = generateRandomMainPosition(3);
        this.positionsCharacters.forEach((item) => {
          item.position = newMainCharsPositionsLevelTwo[0];
          newMainCharsPositionsLevelTwo.splice(0, 1);
        });
        const newOpponentCharsPositionsLevelTwo = generateRandomOpponentPosition(3);
        const newOpponentCharactersLevelTwo = generateTeam(opponentTeamAllowedType, 3, newOpponentCharsPositionsLevelTwo.length);
        const newMainCharactersLevelTwo = generateTeam(mainTeamAllowedType, 3, newMainCharsPositionsLevelTwo.length);
        for (let i = 0; i < newMainCharsPositionsLevelTwo.length; i += 1) {
          this.positionsCharacters.push({ character: newMainCharactersLevelTwo.characters[i], position: newMainCharsPositionsLevelTwo[i] });
        }
        for (let i = 0; i < newOpponentCharsPositionsLevelTwo.length; i += 1) {
          this.positionsCharacters.push({ character: newOpponentCharactersLevelTwo.characters[i], position: newOpponentCharsPositionsLevelTwo[i] });
        }
        this.selectedBox = undefined;
        this.gamePlay.redrawPositions(this.positionsCharacters);
        break;
      case 2:
        this.dangeLevel = 3;
        const newMainCharsPositionsLevelThree = generateRandomMainPosition(5);
        this.positionsCharacters.forEach((item) => {
          item.position = newMainCharsPositionsLevelThree[0];
          newMainCharsPositionsLevelThree.splice(0, 1);
        });
        const newOpponentCharsPositionsLevelThree = generateRandomOpponentPosition(5);
        const newOpponentCharactersLevelThree = generateTeam(opponentTeamAllowedType, 4, newOpponentCharsPositionsLevelThree.length);
        const newMainCharactersLevelThree = generateTeam(mainTeamAllowedType, 4, newMainCharsPositionsLevelThree.length);
        for (let i = 0; i < newMainCharsPositionsLevelThree.length; i += 1) {
          this.positionsCharacters.push({ character: newMainCharactersLevelThree.characters[i], position: newMainCharsPositionsLevelThree[i] });
        }
        for (let i = 0; i < newOpponentCharsPositionsLevelThree.length; i += 1) {
          this.positionsCharacters.push({ character: newOpponentCharactersLevelThree.characters[i], position: newOpponentCharsPositionsLevelThree[i] });
        }
        this.selectedBox = undefined;
        this.gamePlay.redrawPositions(this.positionsCharacters);
        break;
      case 3:
        this.dangeLevel = 4;
        const newMainCharsPositionsLevelFour = generateRandomMainPosition(5);
        this.positionsCharacters.forEach((item) => {
          item.position = newMainCharsPositionsLevelFour[0];
          newMainCharsPositionsLevelFour.splice(0, 1);
        });
        const newOpponentCharsPositionsLevelFour = generateRandomOpponentPosition(5);
        const newOpponentCharactersLevelFour = generateTeam(opponentTeamAllowedType, 4, newOpponentCharsPositionsLevelFour.length);
        const newMainCharactersLevelFour = generateTeam(mainTeamAllowedType, 4, newMainCharsPositionsLevelFour.length);
        for (let i = 0; i < newMainCharsPositionsLevelFour.length; i += 1) {
          this.positionsCharacters.push({ character: newMainCharactersLevelFour.characters[i], position: newMainCharsPositionsLevelFour[i] });
        }
        for (let i = 0; i < newOpponentCharsPositionsLevelFour.length; i += 1) {
          this.positionsCharacters.push({ character: newOpponentCharactersLevelFour.characters[i], position: newOpponentCharsPositionsLevelFour[i] });
        }
        this.selectedBox = undefined;
        console.log(this.positionsCharacters);
        this.gamePlay.redrawPositions(this.positionsCharacters);
        break;
    }
    const idxOpponent = this.positionsCharacters.findIndex((item) => item.character.type === 'daemon' || item.character.type === 'undead' || item.character.type === 'vampire');
    if (idxOpponent === -1 && this.dangeLevel === 4 && this.ui === 'mountain') {
      // TODO
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
      this.gamePlay.saveGameListeners = [];
      this.gamePlay.loadGameListeners = [];
      const allSelected = Array.from(document.querySelectorAll('.selected'));
      allSelected.forEach((item) => item.classList.remove('selected'));
      this.selectedBox = undefined;
      this.gamePlay.setCursor('unset');
    }
  }

  onCellClick(index) {
    // Choose character
    if (this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex((item) => item.position === index);
      if (
        this.positionsCharacters[posIndex].character.type === 'swordsman'
        || this.positionsCharacters[posIndex].character.type === 'bowman'
        || this.positionsCharacters[posIndex].character.type === 'magician'
      ) {
        if (this.selectedBox !== undefined) this.gamePlay.deselectCell(this.selectedBox);
        this.selectedBox = index;
        this.gamePlay.selectCell(index);
      }
    }
    // replace character
    if (this.selectedBox !== undefined && !this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex((item) => item.position === this.selectedBox);
      if (this.positionsCharacters[posIndex]) {
        const allowedPositionsToGo = generateAllowedPositionsToGo(this.selectedBox, this.positionsCharacters[posIndex].character.type);
        const nextIndex = allowedPositionsToGo.findIndex((item) => item === index);
        if (nextIndex !== -1) {
          const greenCell = this.gamePlay.cells[posIndex];
          greenCell.classList.remove('selected-green');
          greenCell.classList.remove('selected');
          this.gamePlay.deselectCell(this.selectedBox);
          this.selectedBox = index;
          this.gamePlay.selectCell(index);
          this.positionsCharacters[posIndex].position = index;
          this.gamePlay.redrawPositions(this.positionsCharacters);
          // Opponents go or attack
          this.botDoAnyThing();
        }
      }
    }
    // attack char
    if (this.selectedBox !== undefined && this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex((item) => item.position === this.selectedBox);
      const targetIndex = this.positionsCharacters.findIndex((item) => item.position === index);
      const allowedPositionsToAttack = generateAllowedPositionsToAttack(this.selectedBox, this.positionsCharacters[posIndex].character.type);
      const attackIndex = allowedPositionsToAttack.findIndex((item) => item === index);
      if (attackIndex !== -1) {
        const attacker = this.positionsCharacters[posIndex].character;
        const target = this.positionsCharacters[targetIndex].character;
        const attack = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        this.gamePlay.showDamage(index, attack)
          .then((item) => {
            target.health -= attack;
            if (target.health <= 0) {
              this.positionsCharacters = this.positionsCharacters.filter((item) => item.character.health >= 0);
              const idxOpponent = this.positionsCharacters.findIndex((item) => item.character.type === 'daemon' || item.character.type === 'undead' || item.character.type === 'vampire');
              if (idxOpponent === -1) {
                this.nextLevel();
              }
            }
            this.gamePlay.redrawPositions(this.positionsCharacters);
            this.botDoAnyThing();
          });
      }
    }
    // TODO: react to click
  }

  onCellEnter(index) {
    if (this.selectedBox === undefined && this.gamePlay.cells[index].hasChildNodes()) {
      const idxOpponent = this.positionsCharacters.findIndex((item) => item.position === index);
      if (
        this.positionsCharacters[idxOpponent].character.type === 'undead'
        || this.positionsCharacters[idxOpponent].character.type === 'vampire'
        || this.positionsCharacters[idxOpponent].character.type === 'daemon'
      ) {
        this.gamePlay.setCursor('not-allowed');
      }
    }

    // TITLE
    if (this.gamePlay.cells[index].hasChildNodes()) {
      const posIndex = this.positionsCharacters.findIndex((item) => item.position === index);
      if (
        this.positionsCharacters[posIndex].character.type === 'swordsman'
        || this.positionsCharacters[posIndex].character.type === 'bowman'
        || this.positionsCharacters[posIndex].character.type === 'magician'
      ) {
        this.gamePlay.setCursor('pointer');
      }
      // RED CIRCLE
      if (this.gamePlay.cells[index].hasChildNodes()) {
        const idxOpponent = this.positionsCharacters.findIndex((item) => item.position === index);
        const charIdx = this.positionsCharacters.findIndex((item) => item.position === this.selectedBox);
        if (this.positionsCharacters[charIdx]) {
          const allowAttack = generateAllowedPositionsToAttack(this.selectedBox, this.positionsCharacters[charIdx].character.type);
          const indexToAttack = allowAttack.findIndex((item) => item === index);
          if (
            this.positionsCharacters[idxOpponent].character.type === 'undead'
          || this.positionsCharacters[idxOpponent].character.type === 'vampire'
          || this.positionsCharacters[idxOpponent].character.type === 'daemon'
          ) {
            if (indexToAttack !== -1) {
              this.lastRedCircle = index;
              this.gamePlay.selectCell(index, 'red');
              this.gamePlay.setCursor('crosshair');
            }
          }
        }
      }

      const { level } = this.positionsCharacters[posIndex].character;
      const { attack } = this.positionsCharacters[posIndex].character;
      const { health } = this.positionsCharacters[posIndex].character;
      const { defence } = this.positionsCharacters[posIndex].character;

      this.gamePlay.showCellTooltip(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`, index);
    }
    // GREEN CIRCLE
    if (this.selectedBox !== undefined) {
      const posIndex = this.positionsCharacters.findIndex((item) => item.position === this.selectedBox);
      if (this.positionsCharacters[posIndex]) {
        const allowAroundPerson = generateAllowedPositionsToGo(this.selectedBox, this.positionsCharacters[posIndex].character.type);
        const indexAround = allowAroundPerson.findIndex((item) => item === index);
        if (indexAround !== -1 && !this.gamePlay.cells[index].hasChildNodes()) {
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
    if (this.gamePlay.cells[index].hasChildNodes()) {
      this.gamePlay.hideCellTooltip(index);
      this.gamePlay.setCursor('unset');
    }
    // REMOVE GREEN CIRCLE
    if (this.selectedBox !== undefined) {
      if (this.lastGreenCircle !== undefined) {
        const greenCell = document.querySelector('.selected-green');
        if (greenCell) {
          greenCell.classList.remove('selected-green');
          greenCell.classList.remove('selected');
        }
        this.gamePlay.setCursor('not-allowed');
      }
      if (this.lastRedCircle !== undefined) {
        const redCell = document.querySelector('.selected-red');
        if (redCell) {
          redCell.classList.remove('selected-red');
          redCell.classList.remove('selected');
        }
        this.gamePlay.setCursor('not-allowed');
      }
    }
    // TODO: react to mouse leave
  }
}
