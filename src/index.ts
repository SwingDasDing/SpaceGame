import { remove } from 'lodash';
import {
    CursorLine,
    Cursor,
    Player,
    Point,
    Projectile,
    Size,
    Star,
    Vector2d,
    World,
    Enemy,
    Entity
} from './classes';
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

    private _world = new World(new Size(10000, 10000));

    private _fpsVal: number = 0;
    private _images: HTMLImageElement[] = [];

    private _relativeMousePosition: Point = new Point(0, 0);

    private _cursor: Cursor;
    private _cursorLine: CursorLine;
    private _backgroundImage: HTMLImageElement;

    constructor() {
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
        InputHandler.init(this._canvas, this._context);

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

        this._world.player = new Player(
            this._context,
            this._world,
            initialPlayerPosition,
            initialPlayerVelocity,
            initialPlayerSize,
            this._images[0],
            0
        );

        this._cursor = new Cursor(this._context, new Point(0, 0));
        this._cursorLine = new CursorLine(this._context, new Point(0, 0));

        const enemy1 = new Enemy(
            this._context,
            new Point(200, 200),
            new Vector2d(0, 0),
            new Size(50, 30),
            3
        );

        const enemy2 = new Enemy(
            this._context,
            new Point(-200, -200),
            new Vector2d(0, 0),
            new Size(50, 30),
            3
        );

        this._world.enemies.push(enemy1, enemy2);

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
            this._world.player.position.x
        ).toString();
        this._playerPosYEl.innerHTML = Math.round(
            this._world.player.position.y
        ).toString();

        /////////

        this._fpsVal++;

        this._rAF = window.requestAnimationFrame(() => this.animate());

        this.focusCamera();

        // Reset canvas background
        this._context.drawImage(
            this._backgroundImage,
            -this._world.size.width / 2,
            -this._world.size.height / 2,
            this._world.size.width,
            this._world.size.height
        );

        // Physics'n'logic stuff
        this.calculateRelativeMousePosition();
        this.calculateAngle();
        InputHandler.handleVelocity(this._world);
        this.handleFiring(deltaTime);
        this.updateCursor();

        // Handle entity updating
        this.updateEntities(deltaTime);

        const playerPos = this._world.player.position;

        this._context.translate(
            playerPos.x - this._previousPos.x,
            playerPos.y - this._previousPos.y
        );

        // More game loop stuff
        this._lastTimestamp = Date.now();
    }

    private generateStars(): void {
        const starCanvas = document.createElement('canvas');
        starCanvas.height = this._world.size.height;
        starCanvas.width = this._world.size.width;
        const starContext = starCanvas.getContext('2d');

        starContext.fillStyle = 'rgba(0,0,0,1)';
        starContext.fillRect(0, 0, starCanvas.width, starCanvas.height);

        for (let index = 0; index < 8000; index++) {
            const pos = new Point(
                Helpers.randomBetween(0, starCanvas.width),
                Helpers.randomBetween(0, starCanvas.height)
            );

            const star = new Star(
                starContext,
                pos,
                undefined,
                Helpers.randomBetween(0, 3),
                Math.random()
            );
            star.update();
        }

        this._backgroundImage = new Image();
        this._backgroundImage.src = starCanvas.toDataURL();
    }

    private calculateAngle() {
        this._world.player.angle =
            Math.atan2(
                this._relativeMousePosition.y - this._world.player.position.y,
                this._relativeMousePosition.x - this._world.player.position.x
            ) +
            Math.PI / 2;
    }

    private calculateRelativeMousePosition(): void {
        this._relativeMousePosition = new Point(
            InputHandler.mousePosition.x - this._world.cameraPosition.x,
            InputHandler.mousePosition.y - this._world.cameraPosition.y
        );
    }

    private handleFiring(deltaTime: number): void {
        this._timeSinceLastShot += deltaTime;
        if (
            InputHandler.downKeys.m1 &&
            this._timeSinceLastShot > 60 / this._world.player.weaponPrimary.rpm
        ) {
            this._world.player.weaponPrimary.fire();
            this._timeSinceLastShot = 0;
        }
        if (
            InputHandler.downKeys.m2 &&
            this._timeSinceLastShot >
                60 / this._world.player.weaponSecondary.rpm
        ) {
            this._world.player.weaponSecondary.fire();
            this._timeSinceLastShot = 0;
        }
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
            -this._world.player.position.x + this._canvas.width / 2,
            -this._world.size.width / 2 + this._canvas.width,
            this._world.size.width / 2
        );
        this._world.cameraPosition.y = Helpers.clamp(
            -this._world.player.position.y + this._canvas.height / 2,
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
        this._world.entities.push(
            new Star(this._context, new Point(0, 0), null, 10, 1)
        );
    }

    public updateCursor(): void {
        this._cursor.position = this._relativeMousePosition;
        this._cursor.rotation = this._world.player.angle;

        this._cursorLine.position = this._world.player.position;
        this._cursorLine.rotation = this._world.player.angle;
    }

    public updateEntities(deltaTime: number): void {
        const entities: Entity[] = [];
        entities.push(...this._world.projectiles);
        entities.push(...this._world.enemies);
        entities.push(this._cursorLine, this._cursor);
        entities.push(this._world.player);
        entities.forEach((entity, index) => {
            entity.update(deltaTime);

            if (entity instanceof Projectile) {
                const projectile = entity;
                this._world.enemies.forEach(enemy => {
                    if (projectile.position.isInside(enemy.hitBox)) {
                        enemy.dead = true;
                        projectile.dead = true;
                    }
                });

                if (entity.dead) {
                    this._world.projectiles.splice(index, 1);
                }
            }

            if (entity instanceof Enemy) {
                if (entity.dead) {
                    remove(
                        this._world.enemies,
                        enemy => enemy.id === entity.id
                    );
                }
            }
        });
    }
}

const app = new Main();
