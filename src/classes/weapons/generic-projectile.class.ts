import { remove, uniqueId } from 'lodash';
import { Entity } from '../entity.class';
import { Point } from '../point.class';
import { Vector2d } from '../vector2d.class';
import { World } from '../world.class';

export class GenericProjectile extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public angle: number
    ) {
        super(context, world, position, velocity);
    }

    public id = uniqueId();
    public draw(): void {}

    public update(deltaTime: number): void {
        if (this.dead) {
            remove(
                this.world.projectiles,
                projectile => projectile.id === this.id
            );
        }
    }
}
