import { Point } from '../classes/indexer';

export class Helpers {
    public static randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max + min)) - min;
    }

    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }

    public static intersection(
        from1: Point,
        to1: Point,
        from2: Point,
        to2: Point
    ): Point {
        const dX: number = to1.x - from1.x;
        const dY: number = to1.y - from1.y;

        const determinant: number =
            dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
        if (determinant === 0) return undefined; // parallel lines

        const lambda: number =
            ((to2.y - from2.y) * (to2.x - from1.x) +
                (from2.x - to2.x) * (to2.y - from1.y)) /
            determinant;
        const gamma: number =
            ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) /
            determinant;

        // check if there is an intersection
        if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) {
            return undefined;
        }

        return new Point(from1.x + lambda * dX, from1.y + lambda * dY);
    }
}
