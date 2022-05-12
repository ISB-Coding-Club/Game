import * as THREE from "three";
import * as CANNON from "cannon-es";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { GameWindowObject } from "./globals/types";
import { checkWebGL } from "./util/webgl";
import { PointerLockControls } from "./controls/pointerlock";
import handleWindowResize from "./util/resize";
import "./game";
import { Socket } from "socket.io-client";
import { emitPlayer } from "./websocket/player";
import uuid from "./util/uuid";

// Main function
export const init = (socket: Socket) => {
    // Check if WebGL is supported
    if (!checkWebGL()) return;

    // Constants
    const gameWindow: GameWindowObject = window;

    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.lookAt(0, 0, 0);

    // Create the world
    const world = new CANNON.World();
    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    world.gravity.set(0, -10, 0);

    // Create the G solver
    const solver = new CANNON.GSSolver();
    solver.iterations = 7;
    solver.tolerance = 0.1;
    world.solver = new CANNON.SplitSolver(solver);

    // Setup the gravity
    world.gravity.set(0, -20, 0);

    // Create the stats panels
    const fps = new Stats();
    fps.dom.style.cssText = "position: fixed; top: 5px; left: 2px;";
    fps.showPanel(0);

    const ms = new Stats();
    ms.dom.style.cssText = "position: fixed; top: 5px; left: 84px;";
    ms.showPanel(1);

    const mb = new Stats();
    mb.dom.style.cssText = "position: fixed; top: 5px; left: 168px;";
    mb.showPanel(2);

    // Dat GUI
    const gui = new dat.GUI({
        name: "Options",
    });

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);

    // Setup the physics material
    const physicsMaterial = new CANNON.Material("physics");
    const pm_physics = new CANNON.ContactMaterial(
        physicsMaterial,
        physicsMaterial,
        {
            friction: 0.0,
            restitution: 0.3,
        }
    );
    world.addContactMaterial(pm_physics);

    // Setup the player
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const playerObject = new THREE.Mesh(geometry, material);
    playerObject.position.set(0, 0, 0);
    playerObject.uuid = uuid();
    const sphere = new CANNON.Cylinder(0.5, 0.5, 1, 16);
    sphere.id = Math.floor(Math.random() * 1000);
    const player = new CANNON.Body({
        mass: 10,
        material: physicsMaterial,
    });
    player.addShape(sphere);
    player.position.set(0, 0, 0);
    player.linearDamping = 0.9;
    player.id = Math.floor(Math.random() * 1000);
    player.fixedRotation = true;
    player.updateMassProperties();
    world.addBody(player);
    scene.add(playerObject);

    // Add it to the GUI
    const playerF = gui.addFolder("player");
    const playerPos = playerF.addFolder("position");
    playerPos.add(playerObject.position, "x").listen();
    playerPos.add(playerObject.position, "y").listen();
    playerPos.add(playerObject.position, "z").listen();

    emitPlayer(player, socket);

    // Create the ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: physicsMaterial });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Create the controls
    const controls = new PointerLockControls(
        camera,
        player,
        playerObject,
        socket
    );
    scene.add(controls.getObject());

    // Add stuff to the window
    gameWindow.players = {};
    gameWindow.players[player.id.toString()] = player;
    gameWindow.objects = {};
    gameWindow.objects[player.id.toString()] = playerObject;

    gameWindow.health = 10;
    gameWindow.food = 10;

    gameWindow.scene = scene;
    gameWindow.world = world;
    gameWindow.stats = {
        fps,
        ms,
        mb,
    };
    gameWindow.controls = controls;
    gameWindow.camera = camera;
    gameWindow.renderer = renderer;
    gameWindow.physicsMaterial = physicsMaterial;

    gameWindow.player = player;
    gameWindow.playerObject = playerObject;

    // Setup the renderer and stats DOM elements
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(fps.dom);
    document.body.appendChild(ms.dom);
    document.body.appendChild(mb.dom);

    // Setup locker
    window.addEventListener("click", () => {
        controls.enable();
    });

    // Setup unlocker
    window.addEventListener("keydown", (e) => {
        if (e.keyCode === 27) {
            controls.disable();
        }
    });

    // Run init
    if (gameWindow.preload) gameWindow.preload(socket);
    if (gameWindow.init) gameWindow.init(socket);
    if (gameWindow.update) gameWindow.update(socket);

    // Setup the resize handler
    window.addEventListener("resize", handleWindowResize);

    // Set food timeout
    setInterval(() => {
        if (!gameWindow.food) return;
        if (gameWindow.food <= 1) return;
        gameWindow.food -= 0;
    }, 5000);

    // Send ready message
    socket.emit("ready");
};

export default init;
