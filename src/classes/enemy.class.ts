import { World } from './indexer';
import { Entity } from './entity.class';
import { Point } from './point.class';
import { Size } from './size.class';
import { Vector2d } from './vector2d.class';

export class Enemy extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public angle: number
    ) {
        super(context, world, position, velocity);
    }

    public speed = 200;
    public highFriction: boolean = false;
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.97;
    private _angleToPlayer: number = 0;
    public hitBox: Point[];

    public draw(): void {
        this.context.save();

        const offsetFactor = 0.8;
        this.context.fillStyle = 'rgba(255, 20, 20, 1)';
        this.context.lineWidth = 3;

        this.context.beginPath();

        this.hitBox = [
            new Point(this.position.x, this.position.y - this.size.height / 2),
            new Point(
                this.position.x + this.size.width / 2,
                this.position.y + this.size.height / 2
            ),
            new Point(
                this.position.x,
                this.position.y + (this.size.height / 2) * offsetFactor
            ),
            new Point(
                this.position.x - this.size.width / 2,
                this.position.y + this.size.height / 2
            )
        ];

        this.hitBox.forEach((point: Point, index: number) => {
            this.hitBox[index] = point.rotate(this.position, this.angle);
        });

        this.context.moveTo(this.hitBox[0].x, this.hitBox[0].y);
        for (let i = 1; i < this.hitBox.length; i++) {
            this.context.lineTo(this.hitBox[i].x, this.hitBox[i].y);
        }

        this.context.fill();
        this.context.restore();
    }

    update(deltaTime: number): void {
        this.draw();
        this.calculateAngle();
        // this.angle = this._angleToPlayer;
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
        const center = Point.Empty;

        this._angleToPlayer =
            Math.atan2(center.y - this.position.y, center.x - this.position.x) +
            Math.PI / 2;
    }
}
