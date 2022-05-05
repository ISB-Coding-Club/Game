import * as THREE from "three";
import * as CANNON from "cannon-es";
import { PlayerInfo } from "./serverstore";
import { GameWindowObject } from "../globals/types";
import { Socket } from "socket.io-client";

const gameWindow: GameWindowObject = window;

export const addPlayer = (data: PlayerInfo) => {
    if (
        !gameWindow.world ||
        !gameWindow.objects ||
        !gameWindow.players ||
        !gameWindow.scene
    )
        return;

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00f0f0 });
    const playerObject = new THREE.Mesh(geometry, material);

    playerObject.position.set(
        data.position.x,
        data.position.y,
        data.position.z
    );

    const sphere = new CANNON.Sphere(1.3);

    const player = new CANNON.Body({
        mass: 5,
        material: gameWindow.physicsMaterial,
    });
    player.id = data.uuid;

    player.addShape(sphere);
    player.position.set(data.position.x, data.position.y, data.position.z);
    player.linearDamping = 0.9;
    player.fixedRotation = true;
    player.updateMassProperties();

    gameWindow.world.addBody(player);
    gameWindow.scene.add(playerObject);

    gameWindow.players[data.uuid] = player;
    gameWindow.objects[data.uuid] = playerObject;
};

export const updatePlayer = (player: PlayerInfo) => {
    if (!gameWindow.players || !gameWindow.objects) return;

    const body = gameWindow.players[player.uuid];
    const object = gameWindow.objects[player.uuid];

    if (!body || !object) return;

    body.position.set(player.position.x, player.position.y, player.position.z);
    body.quaternion.set(
        player.rotation.x,
        player.rotation.y,
        player.rotation.z,
        body.quaternion.w
    );

    object.position.set(
        player.position.x,
        player.position.y,
        player.position.z
    );
    object.quaternion.set(
        player.rotation.x,
        player.rotation.y,
        player.rotation.z,
        object.quaternion.w
    );
};

export const removePlayer = (data: PlayerInfo) => {
    if (
        !gameWindow.players ||
        !gameWindow.objects ||
        !gameWindow.scene ||
        !gameWindow.world
    )
        return;

    const body = gameWindow.players[data.uuid];
    const object = gameWindow.objects[data.uuid];

    if (!body || !object) return;

    gameWindow.world.removeBody(body);
    gameWindow.scene.remove(object);

    delete gameWindow.players[data.uuid];
    delete gameWindow.objects[data.uuid];
};

export const emitPlayer = (player: CANNON.Body, socket: Socket) => {
    const playerInfo: PlayerInfo = {
        uuid: player.id,
        position: {
            x: player.position.x,
            y: player.position.y,
            z: player.position.z,
        },
        rotation: {
            x: player.quaternion.x,
            y: player.quaternion.y,
            z: player.quaternion.z,
        },
        velocity: {
            x: player.velocity.x,
            y: player.velocity.y,
            z: player.velocity.z,
        },
        socketId: socket.id,
        type: "players",
    };
    socket.emit("update", playerInfo);
};

export const updatePlayers = (socket: Socket) => {
    if (!gameWindow.players) return;

    const objects = Object.keys(gameWindow.players);

    for (let i = 0; i < objects.length; i++) {
        const object = gameWindow.players[objects[i]];

        if (!object) continue;

        emitPlayer(object, socket);
    }
};
