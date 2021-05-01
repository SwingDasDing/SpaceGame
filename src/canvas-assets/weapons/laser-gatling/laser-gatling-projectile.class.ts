import { clone } from 'lodash';
import { Helpers } from '../../../services/helpers.service';
import { Vector2d } from '../../../classes/vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Point } from '../../../classes/point.class';
import { Enemy } from '../../enemy.class';

export class LaserGatlingProjectile extends Projectile {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public angle: number,
        public radius: number,
        public playerVelocity?: Vector2d,
        public services?: object
    ) {
        super(context, world, position, velocity, angle, services);
        this.previousPosition = clone(this.position);
    }

    public startPosition: Point = clone(this.position);
    public length = 15;
    public distanceTravelled: number = 0;
    public initialUpdate = true;
    public range = 2500;
    public lifetime: number = 3000; // ms
    public speedFactor = 1000;
    public color = 'rgb(255,0,0)';

    public draw(): void {
        this.context.save();

        this.context.strokeStyle = this.color;
        this.context.shadowColor = this.color;
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.shadowBlur = 10;

        this.context.beginPath();
        this.context.moveTo(this.position.x, this.position.y);
        this.context.lineTo(this.previousPosition.x, this.previousPosition.y);

        this.context.stroke();
        this.context.closePath();

        // this.context.translate(this.position.x, this.position.y);
        // this.context.rotate(this.angle);

        // this.context.beginPath();
        // this.context.moveTo(0, this.length / 2);
        // this.context.lineTo(0, -(this.length / 2));
        // this.context.stroke();
        // this.context.closePath();

        this.context.restore();
    }

    public update(deltaTime: number): void {
        if (this.initialUpdate) {
            // this.velocity = this.velocity.add(this.playerVelocity.divide(4)); // Unsure if this makes the aiming to hard to enjoy

            setTimeout(() => {
                this.dead = true;
            }, this.lifetime);

            this.initialUpdate = false;
        }
        super.update(deltaTime);
        this.draw();
        this.previousPosition = clone(this.position);

        this.applyVelocity(deltaTime);

        this.distanceTravelled = this.startPosition.distanceTo(this.position);

        if (this.distanceTravelled >= this.range) {
            this.dead = true;
        }
    }

    public onHit(): void {
        this.dead = true;
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speedFactor;
        this.position.y += this.velocity.y * delta * this.speedFactor;
    }

    public collidesWith(enemy: Enemy): Point {
        return Helpers.polyLineIntersection(enemy.hitBox, [
            this.position,
            this.previousPosition
        ]);
    }
}
