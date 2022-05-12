import { copyPosition, copyQuaternion } from "../util/copy";
import { GameWindowObject } from "../globals/types";
import { Socket } from "socket.io-client";
import { toVector3 } from "../util/vector";
import { emitCube } from "../websocket/cube";
import { emitPlayer } from "../websocket/player";
import { hudUpdate } from "../ui/update";

const gameWindow: GameWindowObject = window;
let lastCallTime = 0;

// This is the main update loop.
gameWindow.update = (socket: Socket) => {
    // If any of these variables are undefined, we can't do anything,
    // since the game hasn't been initialized.
    if (
        !gameWindow.scene ||
        !gameWindow.camera ||
        !gameWindow.renderer ||
        !gameWindow.world ||
        !gameWindow.objects ||
        !gameWindow.bodies ||
        !gameWindow.stats ||
        !gameWindow.stats.fps ||
        !gameWindow.stats.ms ||
        !gameWindow.stats.mb ||
        !gameWindow.controls ||
        !gameWindow.sceneHud ||
        !gameWindow.cameraHud ||
        !gameWindow.hudTexture ||
        !gameWindow.hudContext ||
        !gameWindow.health ||
        !gameWindow.food ||
        !gameWindow.players ||
        !gameWindow.playerObject ||
        !gameWindow.player
    )
        return;

    // Grab the time and performance to update the stats
    const time = performance.now() / 1000;
    const deltaTime = time - lastCallTime;
    lastCallTime = time;

    // Start the statistics tracking
    gameWindow.stats.fps.begin();
    gameWindow.stats.ms.begin();
    gameWindow.stats.mb.begin();

    // Update the physics world
    gameWindow.world.fixedStep();

    // Update the controls if they are enabled.
    if (gameWindow.controls.isEnabled()) gameWindow.controls.update(deltaTime);

    // Grab all of the objects in the scene
    const objects = Object.keys(gameWindow.objects);

    // Loop through all of the objects
    for (let i = 0; i < objects.length; i++) {
        // Grab the current object and its physics body
        const object = gameWindow.objects[objects[i]];
        const body = gameWindow.bodies[objects[i]];

        // If the object doesn't exist, skip it.
        if (!object || !body) continue;

        // If the position of the object hasn't changed, skip it.
        if (toVector3(object.position) == toVector3(body.position)) continue;

        // Update the position of the object on the client.
        copyPosition(object, body);
        copyQuaternion(object, body);

        // Update the position of the object on the backend server.
        emitCube(object, socket);
    }

    // Grab the current player and its physics body
    const object = gameWindow.playerObject;
    const body = gameWindow.player;

    // If the player doesn't exist, what the heck are you doing here?
    if (object && body) {
        // If the position of the player hasn't changed, skip it.
        if (toVector3(object.position) != toVector3(body.position)) {
            // Update the position of the player on the client.
            copyPosition(object, body);
            copyQuaternion(object, body);

            // Update the position of the player on the backend server.
            emitPlayer(body, socket);
        }
    }

    // Render the scene.
    gameWindow.renderer.render(gameWindow.scene, gameWindow.camera);

    // HUD Update
    hudUpdate();

    // End the statistics tracking
    gameWindow.stats.fps.end();
    gameWindow.stats.ms.end();
    gameWindow.stats.mb.end();

    // Call the update loop again.
    requestAnimationFrame(
        gameWindow.update
            ? () => {
                  if (!gameWindow.update) return;
                  gameWindow.update(socket);
              }
            : () => null
    );
};
