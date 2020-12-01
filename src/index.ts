import * as _ from 'lodash';

import { DownKeys } from './classes/down-keys.class';
import { Entity } from './classes/entity.class';
import { Player } from './classes/player.class';
import { Point } from './classes/point.class';
import { Projectile } from './classes/projectile.class';
import { Size } from './classes/size.class';
import { Star } from './classes/star.class';
import { Vector2d } from './classes/vector2d.class';
import { Keys } from './enums/keys.enum';

class Main {
    private _canvas: HTMLCanvasElement;
    private _fpsCounterEl: HTMLSpanElement;
    private _timerEl: HTMLSpanElement;
    private _context: CanvasRenderingContext2D;
    private _rAF: number = 0; // ms
    private _lastTimestamp = 0;
    private _timeSinceStart = 0;
    private _fpsVal: number = 0;
    private _player: Player;
    private _downKeys: DownKeys = new DownKeys();
    private _mousePosition: Point = new Point(0, 0);
    private _entities: Entity[] = [];

    constructor() {
        this._canvas = document.querySelector('#canvasEl');
        this._fpsCounterEl = document.querySelector('#fpsCounterEl');
        this._timerEl = document.querySelector('#timerEl');
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

        const initialPosition = new Point(0, 0);
        const initialVelocity = new Vector2d(0, 0);
        const initialSize = new Size(60, 40);

        this._player = new Player(
            this._context,
            initialPosition,
            initialVelocity,
            initialSize,
            0
        );
        this._entities.push(this._player);
        this.animate();

        window.addEventListener('mousemove', (event: MouseEvent) => {
            this._mousePosition = new Point(event.x, event.y);
        });

        window.addEventListener('click', (event: MouseEvent) => {
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

            this._entities.push(p);
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            // console.log(event)
            switch (event.key) {
                case Keys.W:
                    this._downKeys.w = true;
                    break;

                case Keys.S:
                    this._downKeys.s = true;
                    break;

                case Keys.D:
                    this._downKeys.d = true;
                    break;

                case Keys.A:
                    this._downKeys.a = true;
                    break;

                case Keys.Space:
                    this._downKeys.space = true;
                    break;

                default:
                    break;
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            switch (event.key) {
                case Keys.W:
                    this._downKeys.w = false;
                    break;

                case Keys.S:
                    this._downKeys.s = false;
                    break;

                case Keys.D:
                    this._downKeys.d = false;
                    break;

                case Keys.A:
                    this._downKeys.a = false;
                    break;

                case Keys.Space:
                    this._downKeys.space = false;
                    break;

                default:
                    break;
            }
        });

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

        this._entities.forEach((entity, index) => {
            entity.update(deltaTime);

            if (entity instanceof Projectile) {
                if (entity.dead) {
                    this._entities.splice(index, 1);
                }
            }
        });

        this._lastTimestamp = Date.now();
    }

    private handleVelocity() {
        const acceleration = 0.1;
        if (this._downKeys.w) {
            this._player.velocity.y -= acceleration;
        }
        if (this._downKeys.s) {
            this._player.velocity.y += acceleration;
        }
        if (this._downKeys.a) {
            this._player.velocity.x -= acceleration;
        }
        if (this._downKeys.d) {
            this._player.velocity.x += acceleration;
        }

        this._player.highFriction = this._downKeys.space;
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
                    this._mousePosition.y +
                    this._canvas.height / 2,
                this._player.position.x -
                    this._mousePosition.x +
                    this._canvas.width / 2
            ) -
            Math.PI / 2;
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
app.init();
