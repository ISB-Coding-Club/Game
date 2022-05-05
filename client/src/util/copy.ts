import * as THREE from "three";
import * as CANNON from "cannon-es";

export const copyPosition = (target: THREE.Object3D, source: CANNON.Body) => {
    target.position.set(
        source.position.x,
        source.position.y,
        source.position.z
    );
};

export const copyQuaternion = (target: THREE.Object3D, source: CANNON.Body) => {
    target.quaternion.set(
        source.quaternion.x,
        source.quaternion.y,
        source.quaternion.z,
        source.quaternion.w
    );
};
