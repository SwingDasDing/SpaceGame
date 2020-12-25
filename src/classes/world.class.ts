import { Enemy } from './enemy.class';
import { Entity } from './entity.class';
import { Player } from './player.class';
import { Point } from './point.class';
import { Size } from './size.class';
import { Projectile } from './weapons/projectile.class';

export class World {
    constructor(public size: Size) {}
    public cameraPosition: Point = Point.Empty;

    public player: Player;
    public entities: Entity[] = [];
    public projectiles: Projectile[] = [];
    public enemies: Enemy[] = [];
}
