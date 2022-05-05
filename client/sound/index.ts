import * as HOWLER from "howler";

export const playSound = (soundLocation: string) => {
    return new Promise((resolve, reject) => {
        const sound = new HOWLER.Howl({
            src: [soundLocation],
        });
        sound.on("playerror", (s, e) => {
            reject(e);
        });
        sound.on("end", () => {
            resolve(true);
        });
        sound.once("load", () => {
            sound.play();
        });
    });
};

export const playSoundV = (soundLocation: string, volume: number) => {
    return new Promise((resolve, reject) => {
        const sound = new HOWLER.Howl({
            src: [soundLocation],
            volume: volume,
        });
        sound.on("playerror", (s, e) => {
            reject(e);
        });
        sound.on("end", () => {
            resolve(true);
        });
        sound.play();
    });
};
