import { uniqueId } from 'lodash';
import { Point } from './point.class';
import { Vector2d } from './vector2d.class';
import { World } from './world.class';

export class Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d
    ) {}

    public id: string = uniqueId();

    public dead: boolean = false;

    public draw(): void {}

    public update(deltaTime: number): void {}
}
