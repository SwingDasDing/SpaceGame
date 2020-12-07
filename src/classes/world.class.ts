import { Entity } from './entity.class';
import { Player } from './player.class';
import { Point } from './point.class';
import { Size } from './size.class';

export class World {
    constructor(public size: Size) {}

    public _player: Player;

    public cameraPosition: Point = Point.Empty;
    public _entities: Entity[] = [];
}
