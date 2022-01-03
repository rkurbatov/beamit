export default class Player {
    #map;
    #cellSize;

    #x;
    #y;
    #angle;
    #status = {
        moving: 'stop',
        rotating: 'stop',
        running: false,
    };
    #rotationSpeed;
    #movementSpeed;

    constructor(map, cellSize) {
        this.#map = map;
        this.#cellSize = cellSize;

        const [initialMapX, initialMapY] = this.#map.player
        this.#x = initialMapX * this.#cellSize;
        this.#y = initialMapY * this.#cellSize;
        this.#angle = 0;

        this.#rotationSpeed = 0.03;
        this.#movementSpeed = cellSize / 20;

        document.onkeydown = this.#onKeyDown.bind(this);
        document.onkeyup = this.#onKeyUp.bind(this);
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get angle () {
        return this.#angle;
    }

    updatePosition() {
        const isMoving = this.#status.moving !== 'stop'
        if (isMoving) {
            const k = this.#status.moving === 'forward' ? +1 : -1
            const runK = this.#status.moving === 'forward' && this.#status.running ? 1.75 : 1;

            const playerOffsetX = Math.sin(this.angle) * k * this.#movementSpeed * runK;
            const playerOffsetY = Math.cos(this.angle) * k * this.#movementSpeed * runK;

            const targetCellX =
                Math.floor(this.y / this.#cellSize) * this.#map.width
                + Math.floor((this.x + playerOffsetX) / this.#cellSize);
            const canStepOnX = this.#map.area[targetCellX] === 0

            const targetCellY =
                Math.floor((this.y + playerOffsetY) / this.#cellSize) * this.#map.width
                + Math.floor(this.x / this.#cellSize);
            const canStepOnY = this.#map.area[targetCellY] === 0

            // The player position is updated if there is an empty space in the target cell.
            // Otherwise, the player slides among the wall (if that's possible).
            if (canStepOnX) this.#x += playerOffsetX
            if (canStepOnY) this.#y += playerOffsetY
        }

        const isRotating = this.#status.rotating !== 'stop'
        if (isRotating) {
            const k = this.#status.rotating === 'left' ? +1 : -1
            this.#angle += k * this.#rotationSpeed;
        }
    }

    #onKeyDown(event) {
        switch(event.code) {
            case "ArrowLeft":
                this.#status.rotating = 'left';
                break;
            case "ArrowRight":
                this.#status.rotating = 'right';
                break;
            case "ArrowDown":
                this.#status.moving = 'backward';
                break;
            case "ArrowUp":
                this.#status.moving = 'forward';
                break;
            case "ShiftLeft":
                this.#status.running = true;
                break;
        }
    }

    #onKeyUp(event) {
        switch(event.code) {
            case "ArrowLeft":
            case "ArrowRight":
                this.#status.rotating = 'stop';
                break;
            case "ArrowDown":
            case "ArrowUp":
                this.#status.moving = 'stop';
                break;
            case "ShiftLeft":
                this.#status.running = false;
                break;
        }
    }
}
