export default class GameMap {
    #mapArea;
    #mapWidth;
    #mapHeight;
    #cellSize;

    constructor(mapData, cellSize) {
        this.#mapArea = mapData.area;
        this.#mapWidth = mapData.width;
        this.#mapHeight = mapData.height;
        this.#cellSize = cellSize;
    }

    render(ctx, player, mapOffsetX = 0, mapOffsetY = 0, opacity = 0.85) {
        for (let row = 0; row < this.#mapHeight; row++) {
            for (let col = 0; col < this.#mapWidth; col++) {
                const elIdx = row * this.#mapWidth + col;
                if (this.#mapArea[elIdx] === 1) {
                    ctx.fillStyle = `rgba(80, 80, 80, ${opacity})`;
                } else {
                    ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
                }
                ctx.fillRect(
                    mapOffsetX + col * this.#cellSize,
                    mapOffsetY + row * this.#cellSize,
                    this.#cellSize,
                    this.#cellSize,
                );
            }
        }

        const playerMapX = mapOffsetX + player.x;
        const playerMapY = mapOffsetY + player.y;

        // Draw player
        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
        ctx.beginPath();
        ctx.arc(playerMapX, playerMapY, 1, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(playerMapX, playerMapY);
        ctx.lineTo(playerMapX + Math.sin(player.angle) * 3, playerMapY + Math.cos(player.angle) * 3);
        ctx.stroke();

        // Ray casting
        const curSin = Math.sin(player.angle) || Number.EPSILON;
        const curCos = Math.cos(player.angle) || Number.EPSILON;

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

        // Draw horizontal ray
        ctx.strokeStyle = `rgba(255, 255, 0, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(playerMapX, playerMapY);
        ctx.lineTo(endX + mapOffsetX, endY + mapOffsetY);
        ctx.stroke();
    }

}
