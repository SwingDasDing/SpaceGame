import _ from 'lodash';
import { Helpers } from '../../../services/helpers.service';
import { Enemy } from '../../enemy.class';
import { Point } from '../../point.class';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';

export class LaserConstantProjectile extends Projectile {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public angle: number,
        public radius: number,
        public playerVelocity: Vector2d
    ) {
        super(context, world, position, velocity, angle);
    }

    public startPosition: Point = _.clone(this.position);
    public length = 1000;
    public distanceTravelled: number = 0;
    public initialUpdate = true;
    public lifetime: null; // ms
    public speedFactor = 100;
    public color = 'rgb(255,0,0)';

    public endPosition: Point;

    public draw(): void {
        this.context.save();

        this.context.strokeStyle = this.color;
        this.context.shadowColor = this.color;

        this.context.lineWidth = 1;
        this.context.lineCap = 'round';
        this.context.shadowBlur = 10;

        this.endPosition = new Point(
            this.position.x,
            this.position.y - this.length
        ).rotate(this.position, -this.angle);

        this.context.beginPath();
        this.context.moveTo(this.position.x, this.position.y);
        this.context.lineTo(this.endPosition.x, this.endPosition.y);
        this.context.stroke();
        this.context.closePath();

        this.context.restore();
    }

    public update(deltaTime: number): void {
        if (this.initialUpdate) {
            if (this.lifetime) {
                setTimeout(() => {
                    this.dead = true;
                }, this.lifetime);
            }

            this.initialUpdate = false;
        }

        super.update(deltaTime);

        this.draw();

        this.applyVelocity(deltaTime);
    }

    public onHit(): void {}

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speedFactor;
        this.position.y += this.velocity.y * delta * this.speedFactor;
    }

    public collidesWith(enemy: Enemy): Point {
        let collision: Point;

        let index = 0;
        for (const point1 of enemy.hitBox) {
            const point2 = enemy.hitBox[++index] || enemy.hitBox[0];
            collision = Helpers.intersection(
                this.position,
                this.endPosition,
                point1,
                point2
            );
            if (collision) {
                return collision;
            }
        }
    }
}
