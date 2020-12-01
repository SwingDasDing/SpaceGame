import { Entity } from './entity.class';
import { Point } from './point.class';
import { Vector2d } from './vector2d.class';

export class Star extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d,
        public radius: number,
        public brightness: number = 1
    ) {
        super(context, position, velocity);
    }

    public draw(): void {
        this.context.save();

        this.context.fillStyle = `rgba(255,255,255,${this.brightness})`;

        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.radius, 0, 360);
        this.context.fill();
        this.context.closePath();

        this.context.restore();
    }
    public update(): void {
        this.draw();
    }
}
