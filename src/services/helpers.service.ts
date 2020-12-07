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
}
