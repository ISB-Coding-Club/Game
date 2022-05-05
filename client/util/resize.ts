import { GameWindowObject } from "../globals/types";

const gameWindow: GameWindowObject = window;

export const handleWindowResize = () => {
    if (!gameWindow.camera || !gameWindow.renderer) return;

    gameWindow.camera.aspect =
        gameWindow.window.innerWidth / gameWindow.window.innerHeight;
    gameWindow.camera.updateProjectionMatrix();

    gameWindow.renderer.setSize(
        gameWindow.window.innerWidth,
        gameWindow.window.innerHeight
    );
};

export default handleWindowResize;
