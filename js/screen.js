export default class GameScreen {
    #canvasEl;
    #canvasCtx;
    #screenWidth;
    #screenHeight;

    constructor(canvasEl, screenWidth, screenHeight) {
        this.#canvasEl = canvasEl;
        this.#canvasCtx = canvasEl.getContext('2d');
        this.#screenWidth = screenWidth;
        this.#screenHeight = screenHeight;
    }

    resizeCanvas() {
        const scale = Math.max(
            this.#screenWidth / window.innerWidth,
            this.#screenHeight / window.innerHeight,
        )
        this.#canvasEl.width = window.innerWidth * scale;
        this.#canvasEl.height = window.innerHeight * scale;
    }

    render() {
        const canvas = this.#canvasEl;
        const ctx = this.#canvasCtx;

        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#202020';
        ctx.fillRect(
            (canvas.width - this.#screenWidth) / 2,
            (canvas.height - this.#screenHeight) / 2,
            this.#screenWidth,
            this.#screenHeight,
        )
    }

    get ctx() {
        return this.#canvasCtx;
    }
}
