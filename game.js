window.onload = async function () {
    const {default: FPS} = await import('./js/fps.js');
    const {default: GameScreen} = await import('./js/screen.js');
    const {default: GameMap} = await import('./js/map.js');
    const {default: Player} = await import('./js/player.js');
    const {default: mapData} = await import('./levels/level1.json', { assert: { type: 'json' }});

    // Init canvas
    const canvasEl = document.getElementById('screen');

    const gameScreen = new GameScreen(canvasEl, 320, 200);
    const fpsCounter = new FPS(60);
    const gameMap = new GameMap(mapData)
    const player = new Player(mapData, GameMap.cellSize)

    gameLoop(gameScreen, gameMap, player, fpsCounter)
}

function gameLoop(screen, map, player, fpsCounter) {
    // Calculate FPS
    fpsCounter.tick();

    screen.resizeCanvas();
    screen.render();

    // draw minimap
    map.renderMinimap(player, screen.ctx)

    // Make the infinite loop
    setTimeout(() => gameLoop(screen, map, player, fpsCounter), fpsCounter.cycleDelay);

    // Render FPS
    fpsCounter.render(screen.ctx, 10, 0, 0)
}
