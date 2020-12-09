import { uniqueId } from 'lodash';
import { Point } from './point.class';
import { Vector2d } from './vector2d.class';

export class Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public position: Point,
        public velocity: Vector2d
    ) {}

    public id: string = uniqueId();

    public dead = false;

    public draw(): void {}

    update(deltaTime: number): void {}
}
