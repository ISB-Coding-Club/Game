import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface Vector3 {
    x: number;
    y: number;
    z: number;
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(x: number): void;
    setY(y: number): void;
    setZ(z: number): void;
}

export class Vector3 implements Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getZ(): number {
        return this.z;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public setY(y: number): void {
        this.y = y;
    }

    public setZ(z: number): void {
        this.z = z;
    }
}

export const toVector3 = (vector: THREE.Vector3 | CANNON.Vec3): Vector3 => {
    return new Vector3(vector.x, vector.y, vector.z);
};
