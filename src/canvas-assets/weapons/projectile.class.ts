import { remove, uniqueId } from 'lodash';
import { Entity } from '../entity.class';
import { Vector2d } from '../../classes/vector2d.class';
import { World } from '../world.class';
import { Point } from '../../classes/point.class';
import { Enemy } from '../enemy.class';

export class Projectile extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public angle: number,
        public services?: object
    ) {
        super(context, world, position, velocity, services);
    }

    public id = uniqueId();
    public dead: boolean = false;
    public previousPosition: Point;
    public draw(): void {}
    public damage: number = 10;

    public update(deltaTime: number): void {
        this.world.enemies.forEach(enemy => {
            if (this.collidesWith(enemy)) {
                enemy.onHit(this);
                this.onHit();
            }
        });

        if (this.dead) {
            remove(
                this.world.projectiles,
                projectile => projectile.id === this.id
            );
        }
    }

    public onHit(): void {}

    public collidesWith(enemy: Enemy): any {}
}
