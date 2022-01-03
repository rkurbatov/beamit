window.onload = async function () {
    const { default: FPS } = await import('./js/fps.js');

    // Init canvas
    const canvasEl = document.getElementById('screen');
    const ctx = canvasEl.getContext('2d');

    // FPS
    const fpsCounter = new FPS();

    gameLoop(canvasEl, ctx, fpsCounter)
}

function gameLoop(canvasEl, ctx, fpsCounter) {
    // Calculate FPS
    fpsCounter.tick();

    // Resize canvas on window resize
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    // Update screen
    ctx.fillStyle = 'Black';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    // Make the infinite loop
    setTimeout(() => gameLoop(canvasEl, ctx, fpsCounter), fpsCounter.cycleDelay);

    // Render FPS
    fpsCounter.render(ctx, 10, 0, 0)
}
