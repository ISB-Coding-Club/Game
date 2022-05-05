import { GameWindowObject } from "../globals/types";
import { InitializationError } from "../globals/errors";
import * as THREE from "three";

const gameWindow: GameWindowObject = window;

export interface Vector3 {
    [0]: number;
    [1]: number;
    [2]: number;
}

export class Line {
    private material: THREE.LineBasicMaterial;
    private points: THREE.Vector3[];
    private geometry: THREE.BufferGeometry;
    private line: THREE.Line;

    constructor(color: number, ...points: Vector3[]) {
        if (!gameWindow.scene || !gameWindow.lines)
            throw new InitializationError("Game has not been initialized!");

        this.material = new THREE.LineBasicMaterial({ color: color });
        this.points = [];

        points.forEach((point) => {
            this.points.push(new THREE.Vector3(point[0], point[1], point[2]));
        });

        this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.line = new THREE.Line(this.geometry, this.material);

        gameWindow.scene.add(this.line);
    }

    get uuid(): string {
        return this.line.uuid;
    }

    get position(): Vector3 {
        return [
            this.line.position.x,
            this.line.position.y,
            this.line.position.z,
        ];
    }

    set position(position: Vector3) {
        this.line.position.set(position[0], position[1], position[2]);
    }

    get rotation(): Vector3 {
        return [
            this.line.rotation.x,
            this.line.rotation.y,
            this.line.rotation.z,
        ];
    }

    set rotation(rotation: Vector3) {
        this.line.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    get scale(): Vector3 {
        return [this.line.scale.x, this.line.scale.y, this.line.scale.z];
    }

    set scale(scale: Vector3) {
        this.line.scale.set(scale[0], scale[1], scale[2]);
    }

    get visible(): boolean {
        return this.line.visible;
    }

    set visible(visible: boolean) {
        this.line.visible = visible;
    }

    get opacity(): number {
        return this.material.opacity;
    }

    set opacity(opacity: number) {
        this.material.opacity = opacity;
    }

    get color(): number {
        return this.material.color.getHex();
    }

    set color(color: number) {
        this.material.color.setHex(color);
    }
}

export default Line;
