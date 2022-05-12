import { roundRect } from "../util/canvas";
import { GameWindowObject } from "../globals/types";
import { multiplyText } from "../util/text";

const gameWindow: GameWindowObject = window;

export const hudUpdate = () => {
    if (
        !gameWindow.hudContext ||
        !gameWindow.sceneHud ||
        !gameWindow.cameraHud ||
        !gameWindow.renderer ||
        !gameWindow.food ||
        !gameWindow.health ||
        !gameWindow.hudTexture
    )
        return;

    // Clear the HUD.
    gameWindow.hudContext.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    // Set the color
    gameWindow.hudContext.fillStyle = "black";

    // Update the health on the HUD.
    gameWindow.hudContext.fillText(
        multiplyText("❤️", gameWindow.health),
        window.innerWidth - 20,
        window.innerHeight - 20
    );

    // Update the food on the HUD.
    gameWindow.hudContext.fillText(
        multiplyText("🦴", 10 - gameWindow.food) +
            multiplyText("🍖", gameWindow.food),
        265,
        window.innerHeight - 20
    );

    // Hotbar slots
    for (let i = -2; i < 3; i++) {
        // Get the offset
        const offset = 45 * i;

        // Draw the slot
        drawSlot(window.innerWidth / 2 + offset, window.innerHeight - 50);

        // Draw the outline for the selected slot
        if (gameWindow.selectedSlot === i) {
            // Styles for it
            gameWindow.hudContext.strokeStyle = "#eeeeee";
            gameWindow.hudContext.lineWidth = 3;

            // Draw the square
            gameWindow.hudContext.strokeRect(
                window.innerWidth / 2 + offset + 2,
                window.innerHeight - 48,
                36,
                36
            );
        }
    }

    // Check if the inventory is open
    if(gameWindow.isInventoryOpen) {
        // Inventory styles
        gameWindow.hudContext.fillStyle = "#999999";

        // Draw the inventory
        roundRect(
            gameWindow.hudContext,
            window.innerWidth / 2 - 200,
            window.innerHeight / 2 - 250,
            450,
            500,
            4
        ).fill();

        // Inventory slots
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 9; i++) {
                drawSlot(
                    window.innerWidth / 2 - (190 - 49 * i),
                    window.innerHeight / 2 + (200 - 49 * j)
                );
            }
        }
    }

    // Tell the game that the HUD has been updated.
    gameWindow.hudTexture.needsUpdate = true;

    gameWindow.renderer.render(gameWindow.sceneHud, gameWindow.cameraHud);
};

export const drawSlot = (posX: number, posY: number) => {
    if (!gameWindow.hudContext) return;

    // Set the style
    gameWindow.hudContext.strokeStyle = "#888888";
    gameWindow.hudContext.fillStyle = "rgba(85, 85, 85, 0.6)";
    gameWindow.hudContext.lineWidth = 5;

    // Draw the outline
    gameWindow.hudContext.strokeRect(posX, posY, 40, 40);

    // Draw the inside
    gameWindow.hudContext.fillRect(posX, posY, 40, 40);
};
