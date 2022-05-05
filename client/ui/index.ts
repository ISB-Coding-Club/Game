import { GameWindowObject } from "../globals/types";
import * as THREE from "three";

const gameWindow: GameWindowObject = window;

export const ui = () => {
    const hudCanvas = document.createElement("canvas");
    hudCanvas.width = window.innerWidth;
    hudCanvas.height = window.innerHeight;

    const hudContext = hudCanvas.getContext("2d");
    if (!hudContext) return;
    hudContext.font = "Normal 20px Arial";
    hudContext.textAlign = "end";
    hudContext.fillStyle = "red";
    hudContext.fillText(
        "Loading...",
        hudCanvas.width - 20,
        hudCanvas.height - 20
    );

    const cameraHud = new THREE.OrthographicCamera(
        -window.innerWidth / 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        -window.innerHeight / 2,
        0,
        30
    );

    const sceneHud = new THREE.Scene();

    const hudTexture = new THREE.Texture(hudCanvas);
    hudTexture.needsUpdate = true;

    const hudMaterial = new THREE.MeshBasicMaterial({
        map: hudTexture,
    });
    hudMaterial.transparent = true;

    const hudGeometry = new THREE.PlaneGeometry(
        window.innerWidth,
        window.innerHeight
    );

    const hudMesh = new THREE.Mesh(hudGeometry, hudMaterial);

    sceneHud.add(hudMesh);

    gameWindow.sceneHud = sceneHud;
    gameWindow.cameraHud = cameraHud;
    gameWindow.hudMesh = hudMesh;
    gameWindow.hudContext = hudContext;
    gameWindow.hudCanvas = hudCanvas;
    gameWindow.hudMaterial = hudMaterial;
    gameWindow.hudTexture = hudTexture;
    gameWindow.hudGeometry = hudGeometry;
};

export default ui;
