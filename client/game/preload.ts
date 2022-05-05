import { GameWindowObject } from "../globals/types";

const gameWindow: GameWindowObject = window;

gameWindow.preload = () => {
    console.log(
        `%c[INFO] %c[${new Date().toUTCString()}] %cPreload`,
        "color: #00FFFF;",
        "color: #cccccc;",
        "color: #ffffff;"
    );
};
