import * as _ from 'lodash';

import { Player } from './classes/player.class';
import { Point } from './classes/point.class';
import { Projectile } from './classes/projectile.class';
import { Size } from './classes/size.class';
import { Star } from './classes/star.class';
import { Vector2d } from './classes/vector2d.class';
import { World } from './classes/world.class';
import { Helpers } from './services/helpers.service';
import { InputHandler } from './services/input-handler.service';

class Main {
    private _canvas: HTMLCanvasElement;
    private _fpsCounterEl: HTMLSpanElement;
    private _timerEl: HTMLSpanElement;
    private _playerPosXEl: HTMLSpanElement;
    private _playerPosYEl: HTMLSpanElement;

    private _context: CanvasRenderingContext2D;
    private _rAF: number = 0; // ms
    private _lastTimestamp = 0;
    private _timeSinceStart = 0;
    private _timeSinceLastShot = 0;

    private _previousPos = new Point(0, 0);

    private _world = new World(new Size(5000, 5000));

    private _fpsVal: number = 0;
    private _images: HTMLImageElement[] = [];

    private _relativeMousePosition: Point = new Point(0, 0);

    private _debugStar: Star;

    constructor() {
        InputHandler.init(this._canvas, this._context);
        this.getElements();

        const image: HTMLImageElement = new Image(256, 256);
        image.src = require('./img/ship-2-256x256.png');

        image.onload = () => {
            this._images.push(image);
            this.init();
        };
    }

    public init(): void {
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        this._context.translate(
            this._canvas.width / 2,
            this._canvas.height / 2
        );

        this._context.fillStyle = this._context.strokeStyle = 'white';

        this.generateStars();
        this.countFps();

        const initialPlayerPosition = new Point(0, 0);
        const initialPlayerVelocity = new Vector2d(0, 0);
        const initialPlayerSize = new Size(64, 64);

        this._world._player = new Player(
            this._context,
            initialPlayerPosition,
            initialPlayerVelocity,
            initialPlayerSize,
            this._images[0],
            0
        );

        this.debug();

        this.animate();
    }

    public animate(): void {
        ///////// Game loop stuff
        let deltaTime = (Date.now() - this._lastTimestamp) / 1000;
        if (deltaTime > 10000) {
            // TODO: needed because first deltaTime is just "date.now()", should probably find a better solution
            deltaTime = 0;
        }
        this._timeSinceStart = this._timeSinceStart + deltaTime;
        this._timerEl.innerHTML = this._timeSinceStart.toFixed(2).toString();
        this._playerPosXEl.innerHTML = Math.round(
            this._world._player.position.x
        ).toString();
        this._playerPosYEl.innerHTML = Math.round(
            this._world._player.position.y
        ).toString();

        /////////

        this._fpsVal++;

        this._rAF = window.requestAnimationFrame(() => this.animate());

        this.focusCamera();

        // Reset canvas background
        this._context.fillStyle = 'rgba(0,0,0,1)';
        this._context.fillRect(
            -this._world.size.width / 2,
            -this._world.size.height / 2,
            this._world.size.width,
            this._world.size.height
        );

        // Physics'n'logic stuff
        this.calculateRelativeMousePosition();
        this.calculateAngle();
        this.handleVelocity();
        this.handleFiring(deltaTime, this._world._player.rpm);
        this._debugStar.position = this._relativeMousePosition;

        // Handle entity updating
        this._world._entities.forEach((entity, index) => {
            entity.update(deltaTime);

            if (entity instanceof Projectile) {
                if (entity.dead) {
                    this._world._entities.splice(index, 1);
                }
            }
        });

        this._world._player.update(deltaTime);

        const playerPos = this._world._player.position;

        this._context.translate(
            playerPos.x - this._previousPos.x,
            playerPos.y - this._previousPos.y
        );

        // More game loop stuff
        this._lastTimestamp = Date.now();
    }

    private handleVelocity() {
        const acceleration = 0.1;
        if (InputHandler.downKeys.w) {
            this._world._player.velocity.y -= acceleration;
        }
        if (InputHandler.downKeys.s) {
            this._world._player.velocity.y += acceleration;
        }
        if (InputHandler.downKeys.a) {
            this._world._player.velocity.x -= acceleration;
        }
        if (InputHandler.downKeys.d) {
            this._world._player.velocity.x += acceleration;
        }

        this._world._player.highFriction = InputHandler.downKeys.space;
    }

    private generateStars(): void {
        for (let index = 0; index < 200; index++) {
            const pos = new Point(
                Helpers.randomBetween(
                    -this._world.size.width / 2,
                    -this._world.size.width / 2
                ),
                Helpers.randomBetween(
                    -this._world.size.height / 2,
                    -this._world.size.height / 2
                )
            );
            this._world._entities.push(
                new Star(
                    this._context,
                    pos,
                    undefined,
                    Helpers.randomBetween(0, 3),
                    Math.random()
                )
            );
        }
    }

    private calculateAngle() {
        this._world._player.angle =
            Math.atan2(
                this._relativeMousePosition.y - this._world._player.position.y,
                this._relativeMousePosition.x - this._world._player.position.x
            ) +
            Math.PI / 2;
    }

    private calculateRelativeMousePosition(): void {
        this._relativeMousePosition = new Point(
            InputHandler.mousePosition.x - this._world.cameraPosition.x,
            InputHandler.mousePosition.y - this._world.cameraPosition.y
        );
    }

    private handleFiring(deltaTime: number, rpm: number): void {
        this._timeSinceLastShot += deltaTime;
        if (InputHandler.downKeys.m1 && this._timeSinceLastShot > 60 / rpm) {
            this.createProjectile();
            this._timeSinceLastShot = 0;
        }
    }

    private createProjectile(): void {
        const vX = Math.cos(this._world._player.angle - Math.PI / 2);
        const vY = Math.sin(this._world._player.angle - Math.PI / 2);
        const velocity = new Vector2d(vX, vY).multiply(5);

        const p: Projectile = new Projectile(
            this._context,
            _.clone(this._world._player.position),
            velocity,
            this._world._player.angle,
            5,
            this._world._player.velocity
        );

        this._world._entities.push(p);
    }

    private countFps(): void {
        setInterval(() => {
            this._fpsCounterEl.innerHTML = this._fpsVal.toString();
            this._fpsVal = 0;
        }, 1000);
    }

    public getElements(): void {
        this._canvas = document.querySelector('#canvasEl');
        this._fpsCounterEl = document.querySelector('#fpsCounterEl');
        this._timerEl = document.querySelector('#timerEl');
        this._playerPosXEl = document.querySelector('#playerPosXEl');
        this._playerPosYEl = document.querySelector('#playerPosYEl');
    }

    private focusCamera(): void {
        this._context.setTransform(1, 0, 0, 1, 0, 0); // reset the transform matrix as it is cumulative
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height); // clear the viewport AFTER the matrix is reset

        // Clamp the camera position to the world bounds while centering the camera around the player
        this._world.cameraPosition.x = Helpers.clamp(
            -this._world._player.position.x + this._canvas.width / 2,
            -this._world.size.width / 2 + this._canvas.width,
            this._world.size.width / 2
        );
        this._world.cameraPosition.y = Helpers.clamp(
            -this._world._player.position.y + this._canvas.height / 2,
            -this._world.size.height / 2 + this._canvas.height,
            this._world.size.height / 2
        );

        this._context.translate(
            this._world.cameraPosition.x,
            this._world.cameraPosition.y
        );
    }

    private debug(): void {
        // DEBUG: Draw star at center
        this._world._entities.push(
            new Star(this._context, new Point(0, 0), null, 10, 1)
        );

        // DEBUG: Draw star at relativeMousePos
        this._debugStar = new Star(this._context, new Point(0, 0), null, 5, 1);
        this._world._entities.push(this._debugStar);
    }
}

const app = new Main();
