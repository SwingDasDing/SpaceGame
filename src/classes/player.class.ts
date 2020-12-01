import { Point } from './point.class';
import { Size } from './size.class';
import { Vector2d } from './vector2d.class';

export class Player{
    constructor(public context: CanvasRenderingContext2D,  public position: Point, public velocity: Vector2d, public size: Size, public angle?: number){}

    public highFriction: boolean = false
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.97;

    public draw(): void {
        this.context.save()

        const offsetFactor = 0.8;
        this.context.fillStyle = "white"
        this.context.strokeStyle = "green"
        this.context.lineWidth = 3 

        this.context.translate(this.position.x, this.position.y)

        this.context.rotate(this.angle)

        this.context.beginPath();

        this.context.moveTo(0, 0 - this.size.height / 2);
        this.context.lineTo(0 + this.size.width / 2 , 0 + this.size.height / 2);
        this.context.lineTo(0 , 0 + this.size.height / 2 * offsetFactor);
        this.context.lineTo(0 - this.size.width / 2 , 0 + this.size.height / 2);  

        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        this.context.restore()
    }

    update(): void {
        this.draw()
        this.angle = this.angle
        this.velocity = this.velocity.multiply(this.highFriction ? this.highFrictionFactor : this.defaultFrictionFactor);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}