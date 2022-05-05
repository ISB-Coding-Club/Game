import io from "socket.io-client";
import init from "../init";
import { addCube, updateCube } from "./cube";
import { addPlayer, removePlayer, updatePlayer } from "./player";
import { CubeInfo, ObjectStore, PlayerInfo } from "./serverstore";

window.addEventListener("load", () => {
    const socket = io();

    socket.on("connect", async () => {
        console.log(
            `%c[INFO] %c[${new Date().toUTCString()}] %cConnected to server with ID ${
                socket.id
            }.`,
            "color: #00FFFF;",
            "color: #cccccc;",
            "color: #ffffff;"
        );

        init(socket);

        socket.on("store", async (data: ObjectStore) => {
            const cubes = Object.keys(data.cubes);
            const players = Object.keys(data.players);

            for (let i = 0; i < cubes.length; i++) {
                addCube(data.cubes[cubes[i]]);
            }

            for (let i = 0; i < players.length; i++) {
                if (data.players[players[i]].socketId === socket.id) continue;
                addPlayer(data.players[players[i]]);
            }
        });

        socket.on("update", async (data: CubeInfo | PlayerInfo) => {
            if (data.type === "cubes") {
                if (data.sender === socket.id) return;
                updateCube(data);
            } else if (data.type === "players") {
                if (data.socketId === socket.id) return;
                if (data.sender === socket.id) return;
                updatePlayer(data);
            }
        });

        socket.on("remove", (data: CubeInfo | PlayerInfo) => {
            if (data.type === "cubes") {
                if (data.sender === socket.id) return;
                // TODO: Remove cube
            } else if (data.type === "players") {
                if (data.socketId === socket.id) return;
                if (data.sender === socket.id) return;
                removePlayer(data);
            }
        });
    });
});
