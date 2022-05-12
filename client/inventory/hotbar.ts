import { GameWindowObject } from "../globals/types";

const gameWindow: GameWindowObject = window;
let s = 0;

export const onScroll = (e: WheelEvent) => {
    s += 1;
    if (s == 7) {
        s = 0;
        if (gameWindow.selectedSlot !== undefined) {
            gameWindow.selectedSlot += e.deltaY > 0 ? 1 : -1;

            if (gameWindow.selectedSlot == -3) gameWindow.selectedSlot = 2;
            else if (gameWindow.selectedSlot == 3) gameWindow.selectedSlot = -2;
        } else gameWindow.selectedSlot = 0;
    }
};
