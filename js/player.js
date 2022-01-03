export default class Player {
    #x;
    #y;
    #angle;

    constructor(map, cellSize) {
        const [mapX, mapY] = map.player
        this.#x = mapX * cellSize;
        this.#y = mapY * cellSize;
        this.#angle = 0;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get angle() {
        return this.#angle;
    }
}
