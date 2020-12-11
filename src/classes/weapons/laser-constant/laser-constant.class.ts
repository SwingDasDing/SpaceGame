import { clone } from 'lodash';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { GenericProjectile } from '../generic-projectile.class';
import { Weapon } from '../weapon.class';
import { LaserConstantProjectile } from './laser-constant-projectile.class';

export class LaserConstant extends Weapon {
    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
    }

    public rpm: number = 3000;

    public fire(deltaTime: number): void {
        this.world.projectiles.push(this.createProjectile());
    }

    public remove(): void {}

    public createProjectile(): GenericProjectile {
        const vX = Math.cos(this.world.player.angle - Math.PI / 2);
        const vY = Math.sin(this.world.player.angle - Math.PI / 2);
        // const velocity = new Vector2d(vX, vY).multiply(5);
        const velocity = new Vector2d(0, 0);

        const p: LaserConstantProjectile = new LaserConstantProjectile(
            this.context,
            this.world,
            clone(this.world.player.position),
            velocity,
            this.world.player.angle,
            5,
            this.world.player.velocity
        );

        return p;
    }
}
