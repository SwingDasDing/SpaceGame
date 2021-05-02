import _ from 'lodash';
import { Helpers } from '../../../services/helpers.service';
import { Enemy } from '../../enemy.class';
import { Vector2d } from '../../../classes/vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Point } from '../../../classes/point.class';

export class RailgunProjectile extends Projectile {
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
        this.damage = 100;
    }

    public startPosition: Point = _.clone(this.position);
    public length = 3000;
    public distanceTravelled: number = 0;
    public initialUpdate = true;
    public lifetime = 500; // ms
    public speedFactor = 100;
    public color = 'rgba(255,255,255, 1)';
    private alphaReduction = 1 / this.lifetime;
    private alpha = 1;
    private passedLifetime = 0;
    public endPosition: Point;
    public firstUpdate = true;

    public draw(): void {
        this.context.save();

        this.context.strokeStyle = this.color;
        this.context.shadowColor = this.color;

        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.shadowBlur = 20;

        this.endPosition = new Point(
            this.position.x,
            this.position.y - this.length
        ).rotate(this.position, -this.angle);

        this.context.beginPath();
        this.context.moveTo(this.position.x, this.position.y);
        this.context.lineTo(this.endPosition.x, this.endPosition.y);
        this.context.stroke();
        this.context.closePath();

        this.context.restore();
    }

    public update(deltaTime: number): void {
        if (this.initialUpdate) {
            if (this.lifetime) {
                setTimeout(() => {
                    this.dead = true;
                }, this.lifetime);
            }
        }
        this.alpha -= this.alphaReduction * (deltaTime * 1000);
        this.color = `rgba(255,255,255, ${this.alpha})`;

        this.draw();

        super.update(deltaTime);

        this.applyVelocity(deltaTime);

        this.passedLifetime += deltaTime * 1000;
        this.firstUpdate = false;
    }

    public onHit(): void {}

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speedFactor;
        this.position.y += this.velocity.y * delta * this.speedFactor;
    }

    public collidesWith(enemy: Enemy): Point {
        if (this.firstUpdate && this.endPosition) {
            this.initialUpdate = false;

            return Helpers.polyLineIntersection(enemy.hitBox, [
                this.position,
                this.endPosition
            ]);
        }
    }
}
