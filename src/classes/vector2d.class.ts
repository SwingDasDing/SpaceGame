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

    public getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public clamp(maxMag: number): Vector2d {
        const currentMag = this.getMagnitude();
        const clampedMag = Math.min(currentMag, maxMag) / currentMag;
        return new Vector2d(clampedMag * this.x, clampedMag * this.y);
    }
}
