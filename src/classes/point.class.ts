export class Point {
    constructor(public x: number, public y: number) {}

    public static get Empty(): Point {
        return new Point(0, 0);
    }

    public distanceTo(pos: Point): number {
        const tempX = this.x - pos.x;
        const tempY = this.y - pos.y;
        return Math.hypot(tempX, tempY);
    }
    public offset(offset: Point): Point {
        return new Point(this.x + offset.x, this.y + offset.y);
    }

    public rotate(origin: Point, radians: number) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const nx =
            cos * (this.x - origin.x) + sin * (this.y - origin.y) + origin.x;
        const ny =
            cos * (this.y - origin.y) - sin * (this.x - origin.x) + origin.y;

        return new Point(nx, ny);
    }

    public isInside(polygon: Point[]): boolean {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

        const x = this.x;
        const y = this.y;

        let inside = false;

        // tslint:disable-next-line:one-variable-per-declaration
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x;
            const yi = polygon[i].y;
            const xj = polygon[j].x;
            const yj = polygon[j].y;

            const intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

            if (intersect) inside = !inside;
        }

        return inside;
    }
}
