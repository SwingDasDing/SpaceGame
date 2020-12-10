import { World } from '../world.class';

export class Weapon {
    constructor(
        public world: World,
        public context: CanvasRenderingContext2D
    ) {}

    public rpm: number = 0;
    public fire(): void {}
    public createProjectile(): any {}
}
