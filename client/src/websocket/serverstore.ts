export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface PlayerInfo {
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    uuid: number;
    socketId: string;
    type: "players";
    sender?: string;
}

export interface CubeInfo {
    position: Vector3;
    rotation: Vector3;
    uuid: string;
    size: Vector3;
    mass?: number;
    color?: number;
    map?: string;
    type: "cubes";
    sender?: string;
}

export interface ObjectStore {
    cubes: { [key: string]: CubeInfo };
    players: { [key: string]: PlayerInfo };
}
