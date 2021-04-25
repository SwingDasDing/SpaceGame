import { World } from '../world.class';

export class Weapon {
    constructor(
        public world: World,
        public context: CanvasRenderingContext2D
    ) {}

    public rpm: number = 0;

    protected _timeSinceLastShot: number = 0;

    public onUpdate(deltaTime: number): void {}
    public fire(deltaTime: number): void {}
    public stop(): void {}
    public createProjectile(): any {}
}
