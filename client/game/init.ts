import { onScroll } from "../inventory/hotbar";
import * as THREE from "three";
import { GameWindowObject } from "../globals/types";
import ui from "../ui";

const gameWindow: GameWindowObject = window;

gameWindow.init = () => {
    console.log(
        `%c[INFO] %c[${new Date().toUTCString()}] %cInit`,
        "color: #00FFFF;",
        "color: #cccccc;",
        "color: #ffffff;"
    );

    if (!gameWindow.scene || !gameWindow.camera || !gameWindow.world) return;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    gameWindow.scene.add(ambientLight);

    const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1);
    spotlight.position.set(10, 30, 20);
    spotlight.target.position.set(0, 0, 0);
    spotlight.castShadow = true;
    spotlight.shadow.camera.near = 10;
    spotlight.shadow.camera.far = 100;
    spotlight.shadow.camera.fov = 30;
    spotlight.shadow.mapSize.width = 2048;
    spotlight.shadow.mapSize.height = 2048;
    gameWindow.scene.add(spotlight);

    const genericMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });

    const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeometry, genericMaterial);
    floor.receiveShadow = true;
    gameWindow.scene.add(floor);

    gameWindow.bodies = {};
    gameWindow.lights = {};
    gameWindow.lines = {};
    gameWindow.text = {};

    gameWindow.lights.ambient = ambientLight;
    gameWindow.lights.spot = spotlight;

    gameWindow.genericMaterial = genericMaterial;

    gameWindow.selectedSlot = -2;

    window.addEventListener("wheel", onScroll);

    ui();
};
