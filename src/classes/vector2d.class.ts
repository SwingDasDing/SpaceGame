export class Vector2d {
    constructor(public x: number, public y: number) {}

    public add(vector: Vector2d) {
        return new Vector2d(this.x + vector.x, this.y + vector.y);
    }

    public subtract(vector: Vector2d) {
        return new Vector2d(this.x - vector.x, this.y - vector.y);
    }

    public multiply(factor: number) {
        return new Vector2d(this.x * factor, this.y * factor);
    }
    public divide(factor: number) {
        return new Vector2d(this.x / factor, this.y / factor);
    }
}
