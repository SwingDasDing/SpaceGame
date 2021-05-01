import { sortBy } from 'lodash';
import { Point } from '../classes/point.class';
import { Size } from '../classes/size.class';
import { Enemy } from './enemy.class';
import { Entity } from './entity.class';
import { Player } from './player.class';

import { Projectile } from './weapons/projectile.class';

export class World {
    constructor(public size: Size) {}
    public cameraPosition: Point = Point.Empty;
    public player: Player;
    public entities: Entity[] = [];
    public projectiles: Projectile[] = [];
    public enemies: Enemy[] = [];
    public debugMode: boolean = true;

    public update() {
        this.enemies = sortBy(this.enemies, e => {
            const playerToEnemy = this.player.position.distanceTo(e.position);
            e.distanceToPlayer = playerToEnemy;
            return playerToEnemy;
        });
    }
}
