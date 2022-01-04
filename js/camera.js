export default class Camera {
    #mapArea;
    #mapWidth;
    #mapHeight;
    #cellSize;
    #screenWidth;
    #castStep;

    #FOV = Math.PI / 3;

    constructor(mapData, cellSize, screenWidth) {
        this.#mapArea = mapData.area;
        this.#mapWidth = mapData.width;
        this.#mapHeight = mapData.height;
        this.#cellSize = cellSize;
        this.#screenWidth = screenWidth;
        this.#castStep = this.#FOV / this.#screenWidth;
    }

    rayCast(player) {
        let angle = player.angle + this.#FOV / 2;

        const endCoords = [];
        for (let ray = 0; ray < this.#screenWidth; ray++) {
            endCoords.push(this.#singleRayCast(player, angle));
            angle -= this.#castStep;
        }
        return endCoords;
    }

    #singleRayCast(player, angle) {
        const curSin = Math.sin(angle) || Number.EPSILON;
        const curCos = Math.cos(angle) || Number.EPSILON;

        // Vertical line intersection
        const rayStartX = Math.floor(player.x / this.#cellSize) * this.#cellSize;
        const dX = (curSin > 0 ? +1 : -1) * this.#cellSize;
        let vertRayEndX = curSin > 0 ? rayStartX + this.#cellSize : rayStartX;
        let vertRayEndY, verticalDepth;

        // Modified Bresenham's line algorithm.
        for (let offset = 0; offset < this.#mapWidth; offset++) {
            verticalDepth = (vertRayEndX - player.x) / curSin;
            vertRayEndY = player.y + verticalDepth * curCos;
            let xIdx = Math.floor(vertRayEndX / this.#cellSize);
            let yIdx = Math.floor(vertRayEndY / this.#cellSize);
            if (curSin <= 0) xIdx--;
            const idx = yIdx * this.#mapWidth + xIdx;
            if (idx < 0 || idx >= this.#mapArea.length - 1) break;
            if (this.#mapArea[idx] !== 0) break;
            vertRayEndX += dX;
        }

        // Horizontal line intersection
        const rayStartY = Math.floor(player.y / this.#cellSize) * this.#cellSize;
        const dY = (curCos > 0 ? +1 : -1) * this.#cellSize;
        let horRayEndY = curCos > 0 ? rayStartY + this.#cellSize : rayStartY;
        let horRayEndX, horizontalDepth;

        for (let offset = 0; offset < this.#mapHeight; offset++) {
            horizontalDepth = (horRayEndY - player.y) / curCos;
            horRayEndX = player.x + horizontalDepth * curSin;
            let xIdx = Math.floor(horRayEndX / this.#cellSize);
            let yIdx = Math.floor(horRayEndY / this.#cellSize);
            if (curCos <= 0) yIdx--;
            const idx = yIdx * this.#mapWidth + xIdx;
            if (idx < 0 || idx >= this.#mapArea.length - 1) break;
            if (this.#mapArea[idx] !== 0) break;
            horRayEndY += dY;
        }

        const endX = verticalDepth < horizontalDepth ? vertRayEndX : horRayEndX;
        const endY = verticalDepth < horizontalDepth ? vertRayEndY : horRayEndY;

        return [endX, endY];
    }
}