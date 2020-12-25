import { clone } from 'lodash';
import { InputHandler } from '../../../services/input-handler.service';
import { Vector2d } from '../../vector2d.class';
import { World } from '../../world.class';
import { Projectile } from '../projectile.class';
import { Weapon } from '../weapon.class';
import { RocketPodProjectile } from './rocket-pod-projectile.class';

export class RocketPod extends Weapon {
    private _image: HTMLImageElement = new Image();

    constructor(public world: World, public context: CanvasRenderingContext2D) {
        super(world, context);
        this._image.src = require('../../../temp/rocket-pod-projectile.png');
    }

    public rpm: number = 100;

    public onUpdate(deltaTime: number): void {
        this._timeSinceLastShot += deltaTime;
        if (
            InputHandler.downKeys.m2 &&
            this._timeSinceLastShot > 60 / this.rpm
        ) {
            this.fire(deltaTime);
            this._timeSinceLastShot = 0;
        }
    }

    public fire(deltaTime: number): void {
        this.world.projectiles.push(this.createProjectile());
    }

    public createProjectile(): Projectile {
        const vX = Math.cos(this.world.player.angle - Math.PI / 2);
        const vY = Math.sin(this.world.player.angle - Math.PI / 2);
        const velocity = new Vector2d(vX, vY).multiply(5);
        const p: RocketPodProjectile = new RocketPodProjectile(
            this.context,
            this.world,
            clone(this.world.player.position),
            velocity,
            this.world.player.angle,
            5,
            this._image,
            this.world.player.velocity
        );
        return p;
    }
}
