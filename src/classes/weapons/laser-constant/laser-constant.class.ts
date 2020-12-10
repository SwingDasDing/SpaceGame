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

    public rpm: number = 1000;

    public fire(): void {
        this.world._entities.push(this.createProjectile());
    }

    public createProjectile(): GenericProjectile {
        const vX = Math.cos(this.world._player.angle - Math.PI / 2);
        const vY = Math.sin(this.world._player.angle - Math.PI / 2);
        // const velocity = new Vector2d(vX, vY).multiply(5);
        const velocity = new Vector2d(0, 0);

        const p: LaserConstantProjectile = new LaserConstantProjectile(
            this.context,
            this.world,
            clone(this.world._player.position),
            velocity,
            this.world._player.angle,
            5,
            velocity
        );

        return p;
    }
}
