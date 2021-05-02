import { Point } from '../classes/point.class';

export class Helpers {
    public static randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    public static polyLineIntersection(
        polygon: Point[],
        line: [Point, Point]
    ): Point {
        let collision: Point;
        let index = 0;
        for (const point1 of polygon) {
            const point2 = polygon[++index] || polygon[0];
            collision = Helpers.intersection(line[0], line[1], point1, point2);
            if (collision) {
                return collision;
            }
        }
    }

    public static mapRange(
        value: number,
        low1: number,
        high1: number,
        low2: number,
        high2: number
    ) {
        return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
    }

    public static shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }
}
