import { Entity } from './entity.class';
import { Point } from './point.class';
import { Size } from './size.class';
import { Vector2d } from './vector2d.class';

export class Player extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public image: HTMLImageElement,
        public angle?: number
    ) {
        super(context, position, velocity);
    }

    public speed = 200;
    public rpm = 900;
    public highFriction: boolean = false;
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.97;

    public draw(): void {
        this.context.save();

        this.context.translate(this.position.x, this.position.y);

        this.context.rotate(this.angle);

        this.context.drawImage(
            this.image,
            -(this.size.width / 2),
            -(this.size.width / 2),
            this.size.width,
            this.size.height
        );

        this.context.restore();
    }

    update(deltaTime: number): void {
        this.draw();

        this.angle = this.angle;
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
}
