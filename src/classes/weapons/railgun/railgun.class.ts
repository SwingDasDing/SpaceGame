import { clone } from 'lodash';
import { InputHandler } from '../../../services/input-handler.service';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Weapon } from '../weapon.class';
import { RailgunProjectile } from './railgun-projectile.class';

export class Railgun extends Weapon {
    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
        addEventListener('mousedown', (e: MouseEvent) => {
            if (this._timeSinceLastShot > 60 / this.rpm && !this._token) {
                this._token = setTimeout(() => {
                    if (InputHandler.downKeys.m1) {
                        this.fire();
                        this._timeSinceLastShot = 0;
                        this._token = undefined;
                    }
                }, this._firingDelay);
            }
        });
    }

    public rpm = 60;

    private _firingDelay = 100; // ms
    private _token: NodeJS.Timeout;

    public railgunProjectile: Projectile;

    public onUpdate(deltaTime: number): void {
        this._timeSinceLastShot += deltaTime;
    }

    public fire(): void {
        this.world.projectiles.push(this.createProjectile());
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
