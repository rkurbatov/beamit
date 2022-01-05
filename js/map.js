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

    renderWorld(ctx, castResult, offset) {
        castResult.forEach(({rayX: endX, rayY: endY, wallHeight, fillStyle}, ray) => {
            ctx.fillStyle = fillStyle;
            ctx.fillRect(offset + ray, (480 - wallHeight)/2, 1, wallHeight);
        })
    }

    render(ctx, player, camera, castResult, mapOffsetX = 0, mapOffsetY = 0, mapScale = 0.1, opacity = 0.45) {
        for (let row = 0; row < this.#mapHeight; row++) {
            for (let col = 0; col < this.#mapWidth; col++) {
                const elIdx = row * this.#mapWidth + col;
                if (this.#mapArea[elIdx] === 1) {
                    ctx.fillStyle = `rgba(80, 80, 80, ${opacity})`;
                } else {
                    ctx.fillStyle = `rgba(150, 150, 150, ${opacity})`;
                }
                ctx.fillRect(
                    mapOffsetX + col * this.#cellSize * mapScale,
                    mapOffsetY + row * this.#cellSize * mapScale,
                    this.#cellSize * mapScale,
                    this.#cellSize * mapScale,
                );
            }
        }

        const playerMapX = (mapOffsetX + player.x) * mapScale;
        const playerMapY = (mapOffsetY + player.y) * mapScale;

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


        ctx.strokeStyle = `rgba(255, 255, 0, 0.02)`;
        ctx.lineWidth = 1;
        castResult.forEach(({rayX: endX, rayY: endY}) => {
            ctx.beginPath();
            ctx.moveTo(playerMapX, playerMapY);
            ctx.lineTo((endX + mapOffsetX) * mapScale, (endY + mapOffsetY) * mapScale);
            ctx.stroke();
        })
    }

}
