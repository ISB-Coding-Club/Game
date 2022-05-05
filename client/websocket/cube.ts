import * as THREE from "three";
import * as CANNON from "cannon-es";
import { CubeInfo } from "./serverstore";
import { GameWindowObject } from "../globals/types";
import { Socket } from "socket.io-client";

const gameWindow: GameWindowObject = window;

export const addCube = (data: CubeInfo) => {
    if (
        !gameWindow.scene ||
        !gameWindow.objects ||
        !gameWindow.world ||
        !gameWindow.bodies
    )
        return;

    const normalMap = data.map
        ? new THREE.TextureLoader().load(
              "http://4.bp.blogspot.com/-nVnWCcT-VkY/VC2FnM6ZOmI/AAAAAAAAA4k/bWRniM20L_s/s1600/T_Wood512_N.jpg"
          )
        : new THREE.TextureLoader().load(
              "http://4.bp.blogspot.com/-nVnWCcT-VkY/VC2FnM6ZOmI/AAAAAAAAA4k/bWRniM20L_s/s1600/T_Wood512_N.jpg"
          );
    const geometry = new THREE.BoxBufferGeometry(
        data.size.x,
        data.size.y,
        data.size.z
    );
    const material = new THREE.MeshBasicMaterial({
        color: data.color || 0x00aaaa,
        map: normalMap,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.uuid = data.uuid;
    cube.position.set(data.position.x, data.position.y, data.position.z);

    const shape = new CANNON.Box(
        new CANNON.Vec3(data.size.x / 2, data.size.y / 2, data.size.z / 2)
    );
    const body = new CANNON.Body({ mass: data.mass || 1 });
    body.position.set(data.position.x, data.position.y, data.position.z);
    body.addShape(shape);

    gameWindow.scene.add(cube);
    gameWindow.world.addBody(body);

    gameWindow.objects[data.uuid] = cube;
    gameWindow.bodies[data.uuid] = body;
};

export const updateCube = (cube: CubeInfo) => {
    if (!gameWindow.objects || !gameWindow.bodies) return;

    const object = gameWindow.objects[cube.uuid];
    const body = gameWindow.bodies[cube.uuid];

    if (!object || !body) return;

    object.position.set(cube.position.x, cube.position.y, cube.position.z);
    body.position.set(cube.position.x, cube.position.y, cube.position.z);

    body.quaternion.set(
        cube.rotation.x,
        cube.rotation.y,
        cube.rotation.z,
        body.quaternion.w
    );
    object.quaternion.set(
        cube.rotation.x,
        cube.rotation.y,
        cube.rotation.z,
        object.quaternion.w
    );
};

export const emitCube = (cube: THREE.Mesh, socket: Socket) => {
    if (!gameWindow.bodies) return;

    const cubeInfo: CubeInfo = {
        position: {
            x: cube.position.x,
            y: cube.position.y,
            z: cube.position.z,
        },
        rotation: {
            x: cube.rotation.x,
            y: cube.rotation.y,
            z: cube.rotation.z,
        },
        uuid: cube.uuid,
        size: {
            x: cube.scale.x,
            y: cube.scale.y,
            z: cube.scale.z,
        },
        mass: (gameWindow.bodies[cube.uuid] || { mass: 1 }).mass,
        type: "cubes",
    };

    socket.emit("update", cubeInfo);
};

export const updateCubes = (socket: Socket) => {
    if (!gameWindow.objects) return;

    const objects = Object.keys(gameWindow.objects);

    for (let i = 0; i < objects.length; i++) {
        const object = gameWindow.objects[objects[i]];

        if (!object) continue;

        emitCube(object, socket);
    }
};
