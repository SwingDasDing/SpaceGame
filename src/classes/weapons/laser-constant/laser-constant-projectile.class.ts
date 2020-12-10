import _ from 'lodash';
import { Point } from '../../point.class';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { GenericProjectile } from '../generic-projectile.class';

export class LaserConstantProjectile extends GenericProjectile {
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
    public length = 2000;
    public distanceTravelled: number = 0;
    public dead = false;
    public initialUpdate = true;
    public lifetime: number = 100; // ms
    public speedFactor = 100;
    public color = 'rgb(255,0,0)';

    public draw(): void {
        this.context.save();

        this.context.strokeStyle = this.color;
        this.context.shadowColor = this.color;

        this.context.lineWidth = 2;
        this.context.lineCap = 'round';
        this.context.shadowBlur = 10;

        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.angle);

        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, -this.length);
        this.context.stroke();
        this.context.closePath();

        this.context.restore();
    }

    public update(deltaTime: number): void {
        if (this.initialUpdate) {
            this.velocity = this.velocity.add(this.playerVelocity.divide(4)); // Unsure if this makes the aiming to hard to enjoy

            setTimeout(() => {
                this.dead = true;
            }, this.lifetime);

            this.initialUpdate = false;
        }
        this.draw();

        this.applyVelocity(deltaTime);

        this.distanceTravelled = this.startPosition.distanceTo(this.position);
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speedFactor;
        this.position.y += this.velocity.y * delta * this.speedFactor;
    }
}
