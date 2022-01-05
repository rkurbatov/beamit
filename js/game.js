const {default: GameScreen} = await import('./screen.js');
const {default: GameMap} = await import('./map.js');
const {default: Player} = await import('./player.js');
const {default: Camera} = await import('./camera.js');
const {default: FPS} = await import('./fps.js');

const {default: mapData} = await import('../levels/level1.json', { assert: { type: 'json' }});

export default function initGame(options) {
    const gameOptions = {
        screenWidth: 800,
        screenHeight: 480,
        fpsRate: 60,
        cellSize: 64,
        ...options,
    }

    const screen = new GameScreen(gameOptions.canvasEl, gameOptions.screenWidth, gameOptions.screenHeight);
    const fpsCounter = new FPS(gameOptions.fpsRate);
    const player = new Player(mapData, gameOptions.cellSize);
    const camera = new Camera(mapData, gameOptions.cellSize, gameOptions.screenWidth);
    const map = new GameMap(mapData, gameOptions.cellSize);

    return {
        screen,
        fpsCounter,
        map,
        player,
        camera,
    }
}