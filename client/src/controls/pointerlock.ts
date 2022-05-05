import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GameWindowObject } from "src/globals/types";
import { Socket } from "socket.io-client";

const gameWindow: GameWindowObject = window;

export class PointerLockControls extends THREE.EventDispatcher {
    private enabled: boolean;
    private camera: THREE.PerspectiveCamera;
    private body: CANNON.Body;
    private velocityFactor: number;
    private jumpVelocity: number;
    private velocity: CANNON.Vec3;
    private inputVelocity: THREE.Vector3;
    private euler: THREE.Euler;
    private pitchObject: THREE.Object3D;
    private yawObject: THREE.Object3D;
    private playerObject: THREE.Object3D;
    private quaternion: THREE.Quaternion;
    private moveForward: boolean;
    private moveBackward: boolean;
    private moveLeft: boolean;
    private moveRight: boolean;
    private canJump: boolean;
    private lockEvent: { type: "lock" };
    private unlockEvent: { type: "unlock" };
    private isLocked: boolean;
    private isThirdPerson: boolean;
    private socket: Socket;

    constructor(camera: THREE.PerspectiveCamera, body: CANNON.Body, player: THREE.Object3D, socket: Socket) {
        super();

        this.enabled = false;
        this.camera = camera;
        this.body = body;
        this.playerObject = player;
        this.socket = socket;

        this.velocityFactor = 0.2;
        this.jumpVelocity = 20;
        this.inputVelocity = new THREE.Vector3();
        this.euler = new THREE.Euler();

        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(this.camera);

        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10;
        this.yawObject.add(this.pitchObject);

        this.quaternion = new THREE.Quaternion();

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.canJump = false;

        const contactNormal = new CANNON.Vec3();
        const upAxis = new CANNON.Vec3(0, 1, 0);

        this.body.addEventListener("collide", (e: any) => {
            const { contact } = e;

            if (contact.bi.id === this.body.id) {
                contact.ni.negate(contactNormal);
            } else {
                contactNormal.copy(contact.ni);
            }

            if (contactNormal.dot(upAxis) > 0.5) {
                this.canJump = true;
            }
        });

        this.velocity = this.body.velocity;

        this.lockEvent = { type: "lock" };
        this.unlockEvent = { type: "unlock" };
        this.isLocked = false;
        this.isThirdPerson = false;
    }

    private connect() {
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
        document.addEventListener(
            "pointerlockchange",
            this.onPointerLockChange
        );
        document.addEventListener("pointerlockerror", this.onPointerLockError);
        document.addEventListener("blur", this.disable);
    }

    private disconnect() {
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        document.removeEventListener(
            "pointerlockchange",
            this.onPointerLockChange
        );
        document.removeEventListener(
            "pointerlockerror",
            this.onPointerLockError
        );
        document.removeEventListener("blur", this.disable);
    }

    public enable() {
        this.connect();
        this.lock();
        this.enabled = true;
    }

    public disable() {
        this.disconnect();
        this.unlock();
        this.enabled = false;
    }

    public dispose() {
        this.disconnect();
    }

    public lock() {
        document.body.requestPointerLock();
        this.isLocked = true;
    }

    public unlock() {
        document.exitPointerLock();
        this.isLocked = false;
    }

    private onPointerLockChange = () => {
        if (document.pointerLockElement) {
            this.dispatchEvent(this.lockEvent);
            this.isLocked = true;
        } else {
            this.dispatchEvent(this.unlockEvent);
            this.isLocked = false;
        }
    };

    private onPointerLockError = () => {
        console.log(
            `%c[ERROR] %c[${new Date().toUTCString()}] %cUnable to use the Pointer Lock API.`,
            "color: #FF3333;",
            "color: #cccccc;",
            "color: #ffffff;"
        );
    };

    public thirdPerson(): boolean {
        return this.isThirdPerson;
    }

    private onMouseMove = (event: MouseEvent) => {
        if (!this.enabled || !this.isLocked) return;

        const { movementX, movementY } = event;

        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;

        this.pitchObject.rotation.x = Math.max(
            -Math.PI / 2,
            Math.min(Math.PI / 2, this.pitchObject.rotation.x)
        );
    };

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 38:
            case 87:
                if(!this.isThirdPerson) this.moveForward = true;
                if(this.isThirdPerson) this.moveBackward = true;
                break;

            case 37:
            case 65:
                if(!this.isThirdPerson) this.moveLeft = true;
                if(this.isThirdPerson) this.moveRight = true;
                break;

            case 40:
            case 83:
                if(!this.isThirdPerson) this.moveBackward = true;
                if(this.isThirdPerson) this.moveForward = true;
                break;

            case 39:
            case 68:
                if(!this.isThirdPerson) this.moveRight = true;
                if(this.isThirdPerson) this.moveLeft = true;
                break;

            case 80:
                this.toggleThirdPerson();
                break;

            case 32:
                if (this.canJump) {
                    this.velocity.y += this.jumpVelocity;
                    this.canJump = false;
                }
                break;
        }
    };

    private onKeyUp = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case 38:
            case 87:
                if(!this.isThirdPerson) this.moveForward = false;
                if(this.isThirdPerson) this.moveBackward = false;
                break;

            case 37:
            case 65:
                if(!this.isThirdPerson) this.moveLeft = false;
                if(this.isThirdPerson) this.moveRight = false;
                break;

            case 40:
            case 83:
                if(!this.isThirdPerson) this.moveBackward = false;
                if(this.isThirdPerson) this.moveForward = false;
                break;

            case 39:
            case 68:
                if(!this.isThirdPerson) this.moveRight = false;
                if(this.isThirdPerson) this.moveLeft = false;
                break;
        }
    };

    private toggleThirdPerson() {
        if(this.isThirdPerson) {
            this.isThirdPerson = false;
            this.camera.position.set(0, 0, 0);
            this.camera.rotation.set(0, 0, 0);
        } else {
            this.isThirdPerson = true;
            this.camera.position.set(0, 3, 0);
            this.camera.lookAt(this.yawObject.position);
        }
    }

    public getObject(): THREE.Object3D {
        return this.yawObject;
    }

    public getDirection(): THREE.Vector3 {
        const vector = new THREE.Vector3(0, 0, -1);
        vector.applyQuaternion(this.yawObject.quaternion);
        return vector;
    }

    public update(delta: number) {
        if (!this.enabled) return;

        if(gameWindow.food && gameWindow.food <= 3) {
            this.velocityFactor = 0.05;
        } else {
            this.velocityFactor = 0.2;
        }

        delta *= 1000;
        delta *= 0.1;

        this.inputVelocity.set(0, 0, 0);

        if (this.moveForward) {
            this.inputVelocity.z = -this.velocityFactor * delta;
        }
        if (this.moveBackward) {
            this.inputVelocity.z = this.velocityFactor * delta;
        }

        if (this.moveLeft) {
            this.inputVelocity.x = -this.velocityFactor * delta;
        }
        if (this.moveRight) {
            this.inputVelocity.x = this.velocityFactor * delta;
        }

        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";

        this.quaternion.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quaternion);

        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;

        this.yawObject.position.set(
            this.body.position.x,
            this.body.position.y,
            this.body.position.z
        );
    }

    public isEnabled(): boolean {
        return this.enabled;
    }
}
