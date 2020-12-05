import { Entity } from './entity.class';
import { Point } from './point.class';
import { Size } from './size.class';
import { Vector2d } from './vector2d.class';

export class Enemy extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public angle?: number
    ) {
        super(context, position, velocity);
    }

    public speed = 200;
    public highFriction: boolean = false;
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.97;
    private _angleToPlayer: number = 0;

    public draw(): void {
        this.context.save();

        const offsetFactor = 0.8;
        this.context.fillStyle = 'rgba(255, 20, 20, 1)';
        this.context.lineWidth = 3;
        this.context.translate(this.position.x, this.position.y);

        this.context.rotate(this.angle);

        this.context.beginPath();

        this.context.moveTo(0, 0 - this.size.height / 2);
        this.context.lineTo(0 + this.size.width / 2, 0 + this.size.height / 2);
        this.context.lineTo(0, 0 + (this.size.height / 2) * offsetFactor);
        this.context.lineTo(0 - this.size.width / 2, 0 + this.size.height / 2);

        this.context.closePath();
        this.context.fill();

        this.context.restore();
    }

    update(deltaTime: number): void {
        this.draw();
        this.calculateAngle();
        this.angle = this._angleToPlayer;
        // this.velocity.x += 0.1;
        // this.velocity.y += 0.1;
        // this.angle += 0.1;

        this.velocity = this.velocity.multiply(
            this.highFriction
                ? this.highFrictionFactor
                : this.defaultFrictionFactor
        );
        this.applyVelocity(deltaTime);
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speed;
        this.position.y += this.velocity.y * delta * this.speed;
    }

    private calculateAngle() {
        const center = Point.Empty();

        this._angleToPlayer =
            Math.atan2(center.y - this.position.y, center.x - this.position.x) +
            Math.PI / 2;
    }
}
