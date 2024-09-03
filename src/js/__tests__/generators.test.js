import Character from "../Character";
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import { characterGenerator, generateAllowedPositionsToAttack, generateAllowedPositionsToGo, generateTeam } from '../generators'

test('should infinity generate new team of allowed types', () => {
    const allwedTypes = [Bowman, Swordsman, Magician];
    const allowedTypesString = ['bowman', 'swordsman', 'magician'];
    const char = characterGenerator(allwedTypes, 3);
    const currChar = char.next().value;
    const includesCurretType = allowedTypesString.includes(currChar.type);
    expect(currChar.level).not.toBe(4);
    expect(includesCurretType).toBeTruthy();
    expect(currChar instanceof Character).toBeTruthy();
});

test('should be a generate normal team', () => {
    const allwedTypes = [Bowman, Swordsman, Magician];
    const allowedTypesString = ['bowman', 'swordsman', 'magician'];
    const mainTeam = generateTeam(allwedTypes, 3, 5);
    expect(mainTeam.characters.length).toBe(5);
    expect(allowedTypesString.includes(mainTeam.characters[0].type)).toBeTruthy()
    expect(mainTeam.characters[1].level).not.toBe(4);
});

test('should be a generate normal positions to go', () => {
    let positions = generateAllowedPositionsToGo(0, 'magician');
    let result = [1, 8, 9];
    expect(positions).toEqual(result);
    positions = generateAllowedPositionsToGo(0, 'bowman');
    result = [1, 2, 8, 16, 9, 10, 17, 18];
    expect(positions).toEqual(result);
});

test('should be a generate normal positions to attack', () => {
    let positions = generateAllowedPositionsToAttack(0, 'swordsman');
    let result = [1, 8, 9];
    expect(positions).toEqual(result);
    positions = generateAllowedPositionsToGo(0, 'bowman');
    result = [1, 2, 8, 16, 9, 10, 17, 18];
    expect(positions).toEqual(result);
});