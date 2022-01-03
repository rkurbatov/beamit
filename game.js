window.onload = async function () {
    const {default: FPS} = await import('./js/fps.js');
    const {default: GameScreen} = await import('./js/screen.js');

    // Init canvas
    const canvasEl = document.getElementById('screen');

    const screen = new GameScreen(canvasEl, 320, 200);
    const fpsCounter = new FPS(60);

    gameLoop(screen, fpsCounter)
}

function gameLoop(screen, fpsCounter) {
    // Calculate FPS
    fpsCounter.tick();

    screen.resizeCanvas();
    screen.render();

    // Make the infinite loop
    setTimeout(() => gameLoop(screen, fpsCounter), fpsCounter.cycleDelay);

    // Render FPS
    fpsCounter.render(screen.ctx, 10, 0, 0)
}
