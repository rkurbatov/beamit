const {default: GameScreen} = await import('./screen.js');
const {default: GameMap} = await import('./map.js');
const {default: Player} = await import('./player.js');
const {default: FPS} = await import('./fps.js');

const {default: mapData} = await import('../levels/level1.json', { assert: { type: 'json' }});

export default function initGame(options) {
    const gameOptions = {
        screenWidth: 320,
        screenHeight: 200,
        fpsRate: 60,
        cellSize: 10,
        ...options,
    }

    const screen = new GameScreen(gameOptions.canvasEl, gameOptions.screenWidth, gameOptions.screenHeight);
    const fpsCounter = new FPS(gameOptions.fpsRate);
    const map = new GameMap(mapData, gameOptions.cellSize);
    const player = new Player(mapData, gameOptions.cellSize);

    return {
        screen,
        fpsCounter,
        map,
        player,
    }
}