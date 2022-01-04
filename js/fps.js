export default class FPS {
    #fpsRate;           // Desired FPS rate
    #cycleDelay;        // Game loop interval
    #prevTimeTick = 0;
    #cycleCount = 0;
    #fpsRateMessage = '...';  // Measured FPS

    constructor(fpsRate) {
        this.#fpsRate = fpsRate;
        this.#cycleDelay = Math.floor(1000 / fpsRate);
    }

    tick() {
        this.#cycleCount += 1;
        if (this.#cycleCount >= this.#fpsRate) {
            this.#cycleCount = 0;
        }

        const now = performance.now()
        // Update FPS rate once per second
        if (this.#cycleCount % this.#fpsRate === 0) {
            const cycleTime = now - this.#prevTimeTick;
            this.#fpsRateMessage = 'FPS: ' + Math.floor(1000 / cycleTime);
        }
        this.#prevTimeTick = now;

    }

    render(ctx, x = 0, y = 0, fontSize = 10) {
        ctx.fillStyle = '#502020';
        ctx.font = `${fontSize}px Monospace`;
        ctx.fillText(this.#fpsRateMessage, x, y + fontSize)
    }

    get cycleDelay() {
        return this.#cycleDelay;
    }
}