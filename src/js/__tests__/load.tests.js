import GameStateService from '../GameStateService';

jest.mock('../GameStateService.js')

test('should be normal load', () => {
    const state = new GameStateService();
    state.load.mockReturnValue('Invalid state');
    const result = state.load()
    expect(result).toBe('Invalid state')
});