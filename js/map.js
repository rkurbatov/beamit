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

    render(ctx, player, camera, mapOffsetX = 0, mapOffsetY = 0, opacity = 0.85) {
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


        // Draw horizontal ray
        ctx.strokeStyle = `rgba(255, 255, 0, 0.02)`;
        ctx.lineWidth = 1;
        camera.rayCast(player).forEach(([endX, endY]) => {
            ctx.beginPath();
            ctx.moveTo(playerMapX, playerMapY);
            ctx.lineTo(endX + mapOffsetX, endY + mapOffsetY);
            ctx.stroke();
        })
    }

}
