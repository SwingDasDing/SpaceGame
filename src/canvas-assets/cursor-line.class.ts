import { Point } from '../classes/point.class';
import { Entity } from './entity.class';
import { World } from './world.class';

export class CursorLine extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public services?: object
    ) {
        super(context, world, position, null, services);
    }

    public rotation: number = 0;
    public length: number = 10000;

    public draw(): void {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.rotation);

        this.context.strokeStyle = `rgba(255,255,255,0.3)`;
        this.context.setLineDash([5, 15]);
        this.context.lineWidth = 1;

        this.context.beginPath();

        this.context.moveTo(0, 0);
        this.context.lineTo(0, -this.length);

        this.context.stroke();

        this.context.closePath();

        this.context.restore();
    }
    public update(): void {
        this.draw();
    }
}
