import * as _ from 'lodash';

import { Enemy } from './classes/enemy.class';
import { Entity } from './classes/entity.class';
import { Player } from './classes/player.class';
import { Point } from './classes/point.class';
import { Projectile } from './classes/projectile.class';
import { Size } from './classes/size.class';
import { Star } from './classes/star.class';
import { Vector2d } from './classes/vector2d.class';
import { InputHandler } from './services/input-handler.service';

class Main {
    private _canvas: HTMLCanvasElement;
    private _fpsCounterEl: HTMLSpanElement;
    private _timerEl: HTMLSpanElement;
    private _imageEl: HTMLImageElement;

    private _context: CanvasRenderingContext2D;
    private _rAF: number = 0; // ms
    private _lastTimestamp = 0;
    private _timeSinceStart = 0;
    private _timeSincelastShot = 0;

    private _fpsVal: number = 0;
    private _player: Player;
    private _entities: Entity[] = [];

    private _projectiles: Entity[] = [];

    private _images: HTMLImageElement[] = [];

    constructor() {
        this._canvas = document.querySelector('#canvasEl');
        this._fpsCounterEl = document.querySelector('#fpsCounterEl');
        this._timerEl = document.querySelector('#timerEl');
        this._imageEl = document.querySelector('#imageEl');

        const image: HTMLImageElement = new Image(256, 256);
        image.src = require('./img/ship-2-256x256.png');

        image.onload = () => {
            this._images.push(image);
            this.init();
        };
    }

    public init(): void {
        InputHandler.init();
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
        const initialPlayerSize = new Size(96, 96);

        this._player = new Player(
            this._context,
            initialPlayerPosition,
            initialPlayerVelocity,
            initialPlayerSize,
            this._images[0],
            0
        );

        const initialEnemyPosition = new Point(-300, -300);
        const initialEnemyVelocity = new Vector2d(2, 1);
        const initialEnemySize = new Size(100, 50);

        const enemy = new Enemy(
            this._context,
            initialEnemyPosition,
            initialEnemyVelocity,
            initialEnemySize,
            ((Math.PI * 2) / 360) * 180
        );

        this._entities.push(this._player, enemy);
        this.animate();

        window.addEventListener('resize', () => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this._context.translate(
                this._canvas.width / 2,
                this._canvas.height / 2
            );
        });
    }

    public animate(): void {
        let deltaTime = (Date.now() - this._lastTimestamp) / 1000;
        if (deltaTime > 100) {
            deltaTime = 0;
        }
        this._timeSinceStart = this._timeSinceStart + deltaTime;
        this._timerEl.innerHTML = this._timeSinceStart.toFixed(2).toString();

        this._fpsVal++;

        this._context.fillStyle = 'rgba(0,0,0,0.2)';
        this._rAF = window.requestAnimationFrame(() => this.animate());

        this._context.fillRect(
            -this._canvas.clientWidth / 2,
            -this._canvas.clientHeight / 2,
            this._canvas.clientWidth,
            this._canvas.clientHeight
        );

        this.calculateAngle();
        this.handleVelocity();
        this.handleFiring(deltaTime, this._player.rpm);

        this._projectiles.forEach((projectile, index) => {
            projectile.update(deltaTime);

            if (projectile instanceof Projectile) {
                if (projectile.dead) {
                    this._projectiles.splice(index, 1);
                }
            }
        });

        this._entities.forEach((entity, index) => {
            entity.update(deltaTime);
        });

        this._lastTimestamp = Date.now();
    }

    private handleVelocity() {
        const acceleration = 0.1;
        if (InputHandler.downKeys.w) {
            this._player.velocity.y -= acceleration;
        }
        if (InputHandler.downKeys.s) {
            this._player.velocity.y += acceleration;
        }
        if (InputHandler.downKeys.a) {
            this._player.velocity.x -= acceleration;
        }
        if (InputHandler.downKeys.d) {
            this._player.velocity.x += acceleration;
        }

        this._player.highFriction = InputHandler.downKeys.space;
    }

    private generateStars(): void {
        for (let index = 0; index < 200; index++) {
            const pos = new Point(
                this.randomBetween(
                    -this._canvas.width / 2,
                    -this._canvas.width / 2
                ),
                this.randomBetween(
                    -this._canvas.height / 2,
                    -this._canvas.height / 2
                )
            );
            this._entities.push(
                new Star(
                    this._context,
                    pos,
                    undefined,
                    this.randomBetween(0, 3),
                    Math.random()
                )
            );
        }
    }

    private calculateAngle() {
        this._player.angle =
            Math.atan2(
                this._player.position.y -
                    InputHandler.mousePosition.y +
                    this._canvas.height / 2,
                this._player.position.x -
                    InputHandler.mousePosition.x +
                    this._canvas.width / 2
            ) -
            Math.PI / 2;
    }

    private handleFiring(deltaTime: number, rpm: number): void {
        this._timeSincelastShot += deltaTime;
        if (InputHandler.downKeys.m1 && this._timeSincelastShot > 60 / rpm) {
            this.createProjectile();
            this._timeSincelastShot = 0;
        }
    }

    private createProjectile(): void {
        const vX = Math.cos(this._player.angle - Math.PI / 2);
        const vY = Math.sin(this._player.angle - Math.PI / 2);
        const velocity = new Vector2d(vX, vY).multiply(5);

        const p: Projectile = new Projectile(
            this._context,
            _.clone(this._player.position),
            velocity,
            this._player.angle,
            5,
            this._player.velocity
        );

        this._projectiles.push(p);
    }

    private countFps(): void {
        setInterval(() => {
            this._fpsCounterEl.innerHTML = this._fpsVal.toString();
            this._fpsVal = 0;
        }, 1000);
    }

    private randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max + min)) - min;
    }
}

const app = new Main();
// app.init();
