export default class GameMap {
    #mapArea;
    #mapWidth;
    #mapHeight;
    #cellSize;

    #wallTexture;
    #floorTexture;

    constructor(mapData, cellSize) {
        this.#mapArea = mapData.area;
        this.#mapWidth = mapData.width;
        this.#mapHeight = mapData.height;
        this.#cellSize = cellSize;
    }

    loadTextures() {
        this.#wallTexture = document.createElement('img');
        this.#wallTexture.src = './assets/wall.jpeg';
        this.#floorTexture = document.createElement('img');
        this.#floorTexture.src = './assets/floor.jpeg';
    }

    renderWorld(ctx, castResult, offset) {
        ctx.fillStyle = 'rgba(0, 0, 15, 0.35)';
        castResult.forEach(({rayX: endX, rayY: endY, wallHeight, verticalRay, textureOffset}, ray) => {
            // Texturize
            ctx.drawImage(
                this.#wallTexture,
                textureOffset,     // Source image X offset
                0,     // Source image Y offset
                1,   // Source image width
                663,   // Source image height
                offset + ray,     // Target image X offset
                (480 - wallHeight)/2,     // Target image Y offset
                1,   // Target image width
                wallHeight    // Target image height
            );
            if (verticalRay) {
                ctx.fillRect(offset + ray, (480 - wallHeight)/2, 1, wallHeight);
            }
        })
    }

    render(ctx, player, camera, castResult, mapOffsetX = 0, mapOffsetY = 0, mapScale = 0.01, opacity = 0.45) {
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
