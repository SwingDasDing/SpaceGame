import { clone } from 'lodash';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Weapon } from '../weapon.class';
import { RailgunProjectile } from './railgun-projectile.class';

export class Railgun extends Weapon {
    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
    }

    public rpm = 60;

    private _firingDelay = 100; // ms
    private _token: NodeJS.Timeout;

    public railgunProjectile: Projectile;

    public onUpdate(deltaTime: number): void {
        this._timeSinceLastShot += deltaTime;
    }

    public fire(deltaTime: number): void {
        if (this._timeSinceLastShot > 60 / this.rpm) {
            this.world.projectiles.push(this.createProjectile());
            this._timeSinceLastShot = 0;
        }
    }

    public remove(): void {}

    public createProjectile(): Projectile {
        const vX = Math.cos(this.world.player.angle - Math.PI / 2);
        const vY = Math.sin(this.world.player.angle - Math.PI / 2);
        const velocity = new Vector2d(0, 0);

        const p: RailgunProjectile = new RailgunProjectile(
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
