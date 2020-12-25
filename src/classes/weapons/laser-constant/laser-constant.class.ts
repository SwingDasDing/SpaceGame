import { clone } from 'lodash';
import { InputHandler } from '../../../services/input-handler.service';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Weapon } from '../weapon.class';
import { LaserConstantProjectile } from './laser-constant-projectile.class';

export class LaserConstant extends Weapon {
    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
    }

    public laserProjectile: Projectile;

    public onUpdate(deltaTime: number): void {
        if (InputHandler.downKeys.m1) {
            if (!this.laserProjectile) {
                this.laserProjectile = this.createProjectile();
                this.world.projectiles.push(this.laserProjectile);
            } else {
                this.laserProjectile.position = clone(
                    this.world.player.position
                );
                this.laserProjectile.angle = this.world.player.angle;
            }
        }

        if (!InputHandler.downKeys.m1 && this.laserProjectile) {
            this.laserProjectile.dead = true;
            this.laserProjectile = null;
        }
    }

    public fire(deltaTime: number): void {
        this.world.projectiles.push(this.createProjectile());
    }

    public remove(): void {}

    public createProjectile(): Projectile {
        const vX = Math.cos(this.world.player.angle - Math.PI / 2);
        const vY = Math.sin(this.world.player.angle - Math.PI / 2);
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
