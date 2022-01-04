window.onload = async function () {
    const canvasEl = document.getElementById('screen');
    const {default: initGame} = await import('./js/game.js');

    const gameInstance = initGame({ canvasEl });
    gameLoop(gameInstance);
}

function gameLoop(gameInstance) {
    const { fpsCounter, screen, player, map} = gameInstance;

    fpsCounter.tick();

    screen.resizeCanvas();
    screen.render();

    player.updatePosition();

    map.render(screen.ctx, player);
    fpsCounter.render(screen.ctx);

    // Make the infinite loop
    setTimeout(() => gameLoop(gameInstance), fpsCounter.cycleDelay);
}
