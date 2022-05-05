import express from "express";
import http from "http";
import proxy from "express-http-proxy";
import { Server } from "socket.io";
import { CubeInfo, ObjectStore, PlayerInfo } from "./store/objects";

const port = process.env.PORT || 3004;
const frontend = process.env.FRONTEND || 3008;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const store: ObjectStore = {
    players: {},
    cubes: {
        initial_cube_1: {
            uuid: "initial_cube_1",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
            type: "cubes",
        },
        initial_cube_2: {
            uuid: "initial_cube_2",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
            type: "cubes",
        },
        initial_cube_3: {
            uuid: "initial_cube_3",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
            type: "cubes",
        },
        initial_cube_4: {
            uuid: "initial_cube_4",
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
            type: "cubes",
        },
    },
};

io.on("connection", (s) => {
    console.log(`[INFO] [${new Date().toUTCString()}] [${s.id}] Connected`);
    s.on("disconnect", () => {
        console.log(
            `[INFO] [${new Date().toUTCString()}] [${s.id}] Disconnected`
        );
        const playerId = Object.keys(store.players).find(
            (id) => store.players[id].socketId === s.id
        );
        if (!playerId || !store.players[playerId])
            return console.log(
                `[WARN] [${new Date().toUTCString()}] [${
                    s.id
                }] Player not found, can't remove.`
            );
        io.emit(
            "remove",
            Object.assign(store.players[playerId], { sender: s.id })
        );
        console.log(`[INFO] [${new Date().toUTCString()}] [${s.id}] Removed player: ${playerId}`);
        delete store.players[playerId];
    });
    s.on("update", (element: CubeInfo | PlayerInfo) => {
        console.log(
            `[INFO] [${new Date().toUTCString()}] [${s.id}] Updated ${
                element.type
            } (${Object.keys(store[element.type]).length} ${
                element.type
            })\n    UUID: ${element.uuid}\n    Old Position: (${(
                store[element.type][element.uuid] || element
            ).position.x.toFixed(2)}, ${(
                store[element.type][element.uuid] || element
            ).position.y.toFixed(2)}, ${(
                store[element.type][element.uuid] || element
            ).position.z.toFixed(
                2
            )})\n    New Position: (${element.position.x.toFixed(
                2
            )}, ${element.position.y.toFixed(2)}, ${element.position.z.toFixed(
                2
            )})\n    Old Rotation: (${(
                store[element.type][element.uuid] || element
            ).rotation.x.toFixed(2)}, ${(
                store[element.type][element.uuid] || element
            ).rotation.y.toFixed(2)}, ${(
                store[element.type][element.uuid] || element
            ).rotation.z.toFixed(
                2
            )})\n    New Rotation: (${element.rotation.x.toFixed(
                2
            )}, ${element.rotation.y.toFixed(2)}, ${element.rotation.z.toFixed(
                2
            )})`
        );
        store[element.type][element.uuid] = element;
        setTimeout(() => {
            io.emit("update", Object.assign(element, { sender: s.id }));
        }, 300);
    });
    s.on("ready", () => {
        console.log(`[INFO] [${new Date().toUTCString()}] [${s.id}] Ready`);
        s.emit("store", store);
    });
});

app.use(proxy(`http://localhost:${frontend}`));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
