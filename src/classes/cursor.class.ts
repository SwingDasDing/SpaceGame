import { Entity } from './entity.class';
import { Point } from './point.class';
import { World } from './world.class';

export class Cursor extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public radius: number = 10
    ) {
        super(context, world, position, null);
    }

    public rotation: number = 0;

    public innerSpaceFactor: number = 3;
    public lineWidth: number = 5;

    public draw(): void {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.rotation);

        this.context.fillStyle = `rgba(255,255,255,1)`;
        this.context.lineWidth = this.lineWidth;

        this.context.beginPath();

        this.context.moveTo(0, this.radius / this.innerSpaceFactor);
        this.context.lineTo(0, this.radius);

        this.context.moveTo(0, -this.radius / this.innerSpaceFactor);
        this.context.lineTo(0, -this.radius);

        this.context.moveTo(this.radius / this.innerSpaceFactor, 0);
        this.context.lineTo(this.radius, 0);

        this.context.moveTo(-this.radius / this.innerSpaceFactor, 0);
        this.context.lineTo(-this.radius, 0);

        this.context.stroke();

        this.context.closePath();

        this.context.restore();
    }
    public update(): void {
        this.draw();
    }
}
