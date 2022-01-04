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

    // Find cell based on currently calculated intersection coordinates in map array
    #checkCell(curX, curY, shouldDecreaseIdxX, shouldDecreaseIdxY) {
        let xIdx = Math.floor(curX / this.#cellSize);
        if (shouldDecreaseIdxX) xIdx--;

        let yIdx = Math.floor(curY / this.#cellSize);
        if (shouldDecreaseIdxY) yIdx--;

        const idx = yIdx * this.#mapWidth + xIdx;
        // Check if idx is within array borders and whether the cell is an obstacle to a ray
        // Condition can be improved, for now 0 means empty space.
        return idx > 0 && idx < this.#mapArea.length - 1 && this.#mapArea[idx] === 0;
    }

    // Based on variation of this algorithm: https://www.youtube.com/watch?v=NbSee-XM7WA
    #singleRayCast(player, angle) {
        const curSin = Math.sin(angle) || Number.EPSILON; // Prevents division by zero exception
        const curCos = Math.cos(angle) || Number.EPSILON;

        // The algorithm moves per one cell forwards or backwards depending on angle
        const dX = (curSin > 0 ? +1 : -1) * this.#cellSize;
        const dY = (curCos > 0 ? +1 : -1) * this.#cellSize;

        // Round function depends on the angle so the nearest intersection will be chosen correctly
        const xRoundFunc = curSin > 0 ? Math.ceil : Math.floor
        const yRoundFunc = curCos > 0 ? Math.ceil : Math.floor

        // Initial ray end coordinates are set to the nearest cell border (the same or the next one depending on view angle)
        let vertRayEndX = xRoundFunc(player.x / this.#cellSize) * this.#cellSize;
        let horizRayEndY = yRoundFunc(player.y / this.#cellSize) * this.#cellSize;

        let vertRayEndY, vertRayLength;
        let horizRayEndX, horizRayLength;

        // The amount of iterations is no more than the width of the map. We move 1 cell at a time horizontally
        // and check if the target cell is a valid cell or an obstacle so we can stop the cycle. The length of the
        // ray is calculated as a hypotenuse of a rectangular triangle with known side and sine.
        for (let offset = 0; offset < this.#mapWidth; offset++) {
            vertRayLength = (vertRayEndX - player.x) / curSin;
            vertRayEndY = player.y + vertRayLength * curCos; // calculate another end point coordinate based on the new ray length
            if (!this.#checkCell(vertRayEndX, vertRayEndY, curSin <= 0, false)) break;
            vertRayEndX += dX; // Increase the first coordinate on +/- cellSize and continue
        }

        // The same for the ray with vertical advancement
        for (let offset = 0; offset < this.#mapHeight; offset++) {
            horizRayLength = (horizRayEndY - player.y) / curCos;
            horizRayEndX = player.x + horizRayLength * curSin;
            if (!this.#checkCell(horizRayEndX, horizRayEndY, false, curCos <= 0)) break;
            horizRayEndY += dY;
        }

        // We need two rays because depending on map and angle one of them may not reach the obstacle to meet with.
        // The real distance is the minimal of two ray lengths.
        const distance = Math.min(vertRayLength, horizRayLength) || Number.EPSILON;
        const k = Math.cos(player.angle - angle); // Coefficient to avoid fisheye effect
        const wallHeight = Math.min(this.#cellSize * 1200 / (distance * k), 480);

        if (vertRayLength < horizRayLength) {
            return {rayX: vertRayEndX, rayY: vertRayEndY, wallHeight, fillStyle: '#aaa'};
        } else {
            return {rayX: horizRayEndX, rayY: horizRayEndY, wallHeight, fillStyle: '#555'};
        }
    }
}