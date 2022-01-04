window.onload = async function () {
    const canvasEl = document.getElementById('screen');
    const {default: initGame} = await import('./js/game.js');

    const gameInstance = initGame({ canvasEl });
    gameLoop(gameInstance);
}

function gameLoop(gameInstance) {
    const { fpsCounter, screen, player, map, camera} = gameInstance;

    fpsCounter.tick();

    screen.resizeCanvas();
    screen.render();

    player.updatePosition();

    const castResult = camera.rayCast(player);

    map.renderWorld(screen.ctx, castResult, screen.offset);
    map.render(screen.ctx, player, camera, castResult);
    fpsCounter.render(screen.ctx);

    // Make the infinite loop
    setTimeout(() => gameLoop(gameInstance), fpsCounter.cycleDelay);
}
