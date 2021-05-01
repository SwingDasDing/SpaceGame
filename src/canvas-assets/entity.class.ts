import { uniqueId } from 'lodash';
import { Point } from '../classes/point.class';
import { Vector2d } from '../classes/vector2d.class';
import { World } from './world.class';

export class Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,

        public services?: object
    ) {}

    public id: string = uniqueId();

    public dead: boolean = false;

    public draw(): void {}

    public update(deltaTime: number): void {}
}
