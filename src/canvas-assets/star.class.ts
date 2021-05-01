import { Entity } from './entity.class';
import { Vector2d } from '../classes/vector2d.class';
import { World } from './world.class';
import { Point } from '../classes/point.class';

export class Star extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d,
        public radius: number,
        public world: World,
        public brightness: number = 1,
        public services?: object
    ) {
        super(context, world, position, velocity, services);
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
