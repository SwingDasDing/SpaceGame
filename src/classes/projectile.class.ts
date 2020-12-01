import _ from 'lodash';
import { Entity } from './entity.class';
import { Point } from './point.class';
import { Vector2d } from './vector2d.class';

export class Projectile extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d,
        public angle: number,
        public radius: number,
        public playerVelocity?: Vector2d
    ) {
        super(context, position, velocity);
    }

    public startPosition: Point = _.clone(this.position);
    public length = 15;
    public distanceTravelled: number = 0;
    public dead = false;
    public initialCompute = true;
    public range = 1500;
    public lifetime: number = 3000; // ms

    public draw(): void {
        this.context.save();

        this.context.strokeStyle = 'white';
        this.context.lineWidth = 2;

        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.angle);

        this.context.beginPath();
        this.context.moveTo(0, this.length / 2);
        this.context.lineTo(0, -(this.length / 2));
        this.context.stroke();
        this.context.closePath();

        this.context.restore();
    }
    public update(): void {
        if (this.initialCompute) {
            this.velocity = this.velocity.add(this.playerVelocity.divide(2));

            setTimeout(() => {
                this.dead = true;
            }, this.lifetime);

            this.initialCompute = false;
        }
        this.draw();

        this.applyVelocity();

        this.distanceTravelled = this.startPosition.distanceTo(this.position);

        if (this.distanceTravelled >= this.range) {
            this.dead = true;
        }
    }

    public applyVelocity(): void {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
