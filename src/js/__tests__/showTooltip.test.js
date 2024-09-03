import Bowman from "../characters/Bowman";

test('should be a normal show title', () => {
    const bowman = new Bowman(3);

    const { level } = bowman;
    const { attack } = bowman;
    const { health } = bowman;
    const { defence } = bowman;

    expect(`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`).toBe(`🎖3 ⚔25 🛡25 ❤50`)
});