import Line from "../objects/line";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import Stats from "stats.js";
import { PointerLockControls } from "../controls/pointerlock";
import { Socket } from "socket.io-client";

export type PreloadFunction = (socket: Socket) => void;
export type InitFunction = (socket: Socket) => void;
export type UpdateFunction = (socket: Socket) => void;

export interface GameWindowObject extends Window {
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    world?: CANNON.World;
    stats?: {
        fps?: Stats;
        ms?: Stats;
        mb?: Stats;
    };
    preload?: PreloadFunction;
    controls?: PointerLockControls;
    init?: InitFunction;
    update?: UpdateFunction;
    objects?: { [key: string]: THREE.Mesh };
    bodies?: { [key: string]: CANNON.Body };
    lines?: { [key: string]: Line };
    text?: { [key: string]: THREE.Mesh };
    lights?: { [key: string]: THREE.Light };
    genericMaterial?: THREE.Material;
    physicsMaterial?: CANNON.Material;
    sceneHud?: THREE.Scene;
    cameraHud?: THREE.OrthographicCamera;
    hudMesh?: THREE.Mesh;
    hudMaterial?: THREE.Material;
    hudTexture?: THREE.Texture;
    hudGeometry?: THREE.PlaneGeometry;
    hudCanvas?: HTMLCanvasElement;
    hudContext?: CanvasRenderingContext2D;
    health?: number;
    food?: number;
    players?: { [key: string]: CANNON.Body };
    playerObject?: THREE.Object3D;
    player?: CANNON.Body;
    selectedSlot?: number;
    isInventoryOpen?: boolean;
}
