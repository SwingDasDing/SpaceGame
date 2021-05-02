import { remove, uniqueId } from 'lodash';
import { Point } from '../classes/point.class';
import { Vector2d } from '../classes/vector2d.class';
import { Helpers } from '../services/helpers.service';
import { Entity } from './entity.class';
import { World } from './world.class';

export class Explosion extends Entity {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public size: number,
        public lifetime: number,
        public drawOnUpdate: boolean = false
    ) {
        super(context, world, position, null);
        const smallParticleColour = '255,110,0';
        const largeParticleColour = '150,0,0';
        const smokeParticleColour = '178,178,178';

        for (let i = 0; i < 100; i++) {
            this.smallParticles[i] = new Particle(
                this.context,
                Helpers.randomBetween(0, 5) * this.size,
                new Vector2d(
                    Helpers.randomBetween(-50, 50) * Math.random() * this.size,
                    Helpers.randomBetween(-50, 50) * Math.random() * this.size
                ),
                smallParticleColour
            );
        }
        for (let i = 0; i < 25; i++) {
            this.largeParticles[i] = new Particle(
                this.context,
                Helpers.randomBetween(5, 15) * this.size,
                new Vector2d(
                    Helpers.randomBetween(-20, 20) * Math.random() * this.size,
                    Helpers.randomBetween(-20, 20) * Math.random() * this.size
                ),
                largeParticleColour
            );
        }
        for (let i = 0; i < 10; i++) {
            this.smokeParticles[i] = new Particle(
                this.context,
                Helpers.randomBetween(5, 20) * this.size,
                new Vector2d(
                    Helpers.randomBetween(-20, 20) * Math.random() * this.size,
                    Helpers.randomBetween(-20, 20) * Math.random() * this.size
                ),
                smokeParticleColour
            );
        }
        this.allParticles = Helpers.shuffleArray([
            ...this.smallParticles,
            ...this.largeParticles
        ]);
        this.allParticles.unshift(...this.smokeParticles);
    }

    public id = uniqueId();

    public speed = 300;

    private smokeParticles: Particle[] = [];
    private smallParticles: Particle[] = [];
    private largeParticles: Particle[] = [];
    private allParticles: Particle[] = [];

    private passedLifetime: number = 0;

    public draw(): void {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.allParticles.forEach(p => p.draw());
        this.drawLayer1();
        this.context.restore();
    }

    public update(delta: number): void {
        this.passedLifetime += delta;
        this.allParticles.forEach(p => p.update(delta));

        if (this.drawOnUpdate) {
            this.draw();
        }

        if (this.passedLifetime >= this.lifetime) {
            remove(
                this.world.explosions,
                explosion => explosion.id === this.id
            );
        }
    }

    public drawLayer1(): void {}
}

// tslint:disable-next-line: max-classes-per-file
export class Particle {
    constructor(
        public context: CanvasRenderingContext2D,
        public size: number,
        public velocity: Vector2d,
        public colour: string
    ) {}

    public position = Point.Empty;

    public speed = 5;

    public opacity = 1;

    public update(deltaTime: number) {
        this.applyVelocity(deltaTime);
        this.opacity -= 0.008;
    }

    public draw() {
        this.context.fillStyle = `rgba(${this.colour},${this.opacity})`;
        this.context.beginPath();
        this.context.arc(this.position.x, this.position.y, this.size, 0, 360);
        this.context.fill();
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speed;
        this.position.y += this.velocity.y * delta * this.speed;
    }
}
