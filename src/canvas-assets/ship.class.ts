import { Entity } from './entity.class';

import { Vector2d } from '../classes/vector2d.class';
import { LaserGatling } from './weapons/laser-gatling/laser-gatling.class';
import { Railgun } from './weapons/railgun/railgun.class';
import { Weapon } from './weapons/weapon.class';
import { World } from './world.class';
import { ShipModel } from '../classes/ship-model.class';
import { Point } from '../classes/point.class';
import { Size } from '../classes/size.class';
import { Projectile } from './weapons/projectile.class';

export class Ship extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public shipModel: ShipModel,
        public angle?: number,
        public services?: object
    ) {
        super(context, world, position, velocity, services);
    }

    public weaponPrimary: Weapon = new Railgun(this.world, this.context);
    public weaponSecondary: Weapon = new LaserGatling(this.world, this.context);

    public speed = 200;
    public highFriction: boolean = false;
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.9;
    public hitBox: Point[] = [];
    public maxHealth: number = this.shipModel.health;
    public health: number = this.shipModel.health;

    public draw(): void {}

    public update(deltaTime: number): void {}

    public applyVelocity(delta: number): void {}

    public onHit(projectile: Projectile): void {}

    public onDestroy(): void {}
}
