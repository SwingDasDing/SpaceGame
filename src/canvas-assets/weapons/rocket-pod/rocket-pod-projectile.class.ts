import _, { clone } from 'lodash';
import { Vector2d } from '../../../classes/vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Point } from '../../../classes/point.class';
import { Enemy } from '../../enemy.class';
import { Helpers } from '../../../services/helpers.service';
import { Size } from '../../../classes/size.class';

export class RocketPodProjectile extends Projectile {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public angle: number,
        public radius: number,
        public image: HTMLImageElement,
        public size: Size,
        public playerVelocity?: Vector2d
    ) {
        super(context, world, position, velocity, angle);
        this.previousPosition = clone(this.position);
    }

    public startPosition: Point = _.clone(this.position);
    public length = 15;
    public distanceTravelled: number = 0;
    public initialUpdate = true;
    public range = 2500;
    public lifetime: number = 6000; // ms
    public speedFactor = 150;
    public color = 'rgb(255,0,0)';

    public draw(): void {
        this.context.save();

        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.angle);
        this.context.drawImage(
            this.image,
            -this.size.height / 2,
            -this.size.width / 2,
            this.size.height,
            this.size.width
        );

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
        super.update(deltaTime);
        this.draw();
        this.previousPosition = clone(this.position);

        this.applyVelocity(deltaTime);

        this.distanceTravelled = this.startPosition.distanceTo(this.position);

        if (this.distanceTravelled >= this.range) {
            this.dead = true;
        }
    }

    public onHit(): void {
        this.dead = true;
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speedFactor;
        this.position.y += this.velocity.y * delta * this.speedFactor;
    }

    public collidesWith(enemy: Enemy): Point {
        return Helpers.polyLineIntersection(enemy.hitBox, [
            this.position,
            this.previousPosition
        ]);
    }
}
