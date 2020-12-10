import { clone } from 'lodash';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { GenericProjectile } from '../generic-projectile.class';
import { Weapon } from '../weapon.class';
import { LaserGatlingProjectile } from './laser-gatling-projectile.class';

export class LaserGatling extends Weapon {
    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
    }

    public rpm: number = 800;

    public fire(): void {
        this.world._entities.push(this.createProjectile());
    }

    public createProjectile(): GenericProjectile {
        const vX = Math.cos(this.world._player.angle - Math.PI / 2);
        const vY = Math.sin(this.world._player.angle - Math.PI / 2);
        const velocity = new Vector2d(vX, vY).multiply(5);
        const p: LaserGatlingProjectile = new LaserGatlingProjectile(
            this.context,
            this.world,
            clone(this.world._player.position),
            velocity,
            this.world._player.angle,
            5,
            this.world._player.velocity
        );
        return p;
    }
}
