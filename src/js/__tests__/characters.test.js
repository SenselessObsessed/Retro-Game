import Character from "../Character";
import Swordsman from '../characters/Swordsman';
import Bowman from '../characters/Bowman';
import Magician from '../characters/Magician';
import { characterGenerator, generateTeam } from '../generators'

test('should be a throw error if create Character', async () => {
    expect(() => new Character(3, 'none')).toThrow('Cant create a of class Character')
});

test('should be a create extendet of Character', () => {
    expect(() => new Bowman(3)).not.toThrow()
});

test('should be a normal haracteristic of lvl 1 bowman', () => {
    const bowman = new Bowman(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
});

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
    
});