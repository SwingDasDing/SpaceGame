export class Point {
    constructor(public x: number, public y: number) {}

    public distanceTo(pos: Point): number {
        const tempX = this.x - pos.x;
        const tempY = this.y - pos.y;
        return Math.hypot(tempX, tempY);
    }

    public static get Empty(): Point {
        return new Point(0, 0);
    }
}
