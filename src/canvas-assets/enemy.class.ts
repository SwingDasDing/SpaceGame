import { Vector2d } from '../classes/vector2d.class';
import { Ship } from './ship.class';
import { clone, remove } from 'lodash';
import { Point } from '../classes/point.class';
import { World } from './world.class';
import { Size } from '../classes/size.class';
import { ShipModel } from '../classes/ship-model.class';
import { Projectile } from './weapons/projectile.class';
import { Helpers } from '../services/helpers.service';
// import { Explosion } from './explosion.class';

export class Enemy extends Ship {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public shipModel: ShipModel,
        public angle: number
    ) {
        super(context, world, position, velocity, size, shipModel, angle);
    }

    public distanceToPlayer: number;

    private _angleToPlayer: number = 0;

    //private explosion: Explosion;

    public draw(): void {
        this.drawShip();
        this.drawHealthbar();
        this.calculateHitbox();
    }

    public update(deltaTime: number): void {
        // if (this.explosion) {
        //     this.explosion.update(deltaTime);
        // }

        if (this.dead) {
            this.onDestroy();
        }
        this.calculateAngle();
        this.angle = this._angleToPlayer;

        this.velocity = this.velocity.multiply(
            this.highFriction
                ? this.highFrictionFactor
                : this.defaultFrictionFactor
        );
        this.applyVelocity(deltaTime);
        this.draw();
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speed;
        this.position.y += this.velocity.y * delta * this.speed;
    }
    public onHit(projectile: Projectile): void {
        this.health -= projectile.damage;
        if (this.health <= 0) {
            this.dead = true;
            this.onDestroy();
        }
    }

    public onDestroy(): void {
        //this.explosion = new Explosion(this.context, this.position, 10, 100);
        setTimeout(() => {
            remove(this.world.enemies, enemy => enemy.id === this.id);
        }, 1000);
    }

    private calculateAngle() {
        this._angleToPlayer =
            -Math.atan2(
                this.position.y - this.world.player.position.y,
                this.position.x - this.world.player.position.x
            ) +
            Math.PI / 2;
    }

    public calculateHitbox(): void {
        if (this.dead) {
            this.hitBox = [];
            return;
        }
        this.hitBox = clone(this.shipModel.hitBox);
        this.hitBox.forEach((point: Point, index: number) => {
            this.hitBox[index] = point
                .offset(this.position)
                .rotate(this.position, this.angle);
        });

        if (this.world.debugMode) {
            this.context.save();
            this.context.fillStyle = 'rgba(255, 20, 20, 0.5)';
            this.context.lineWidth = 3;

            this.context.beginPath();

            this.context.moveTo(this.hitBox[0].x, this.hitBox[0].y);
            for (let i = 1; i < this.hitBox.length; i++) {
                this.context.lineTo(this.hitBox[i].x, this.hitBox[i].y);
            }
            this.context.fill();
            this.context.restore();
        }
    }

    public drawShip() {
        this.context.save();

        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(-this.angle);
        // if (this.shipModel.image?.src) {
        //     this.context.drawImage(
        //         this.shipModel.image,
        //         -(this.size.width / 2),
        //         -(this.size.height / 2),
        //         this.size.width,
        //         this.size.height
        //     );
        // }

        this.context.restore();
    }

    public drawHealthbar() {
        const healthbarHeight = -15;
        this.context.save();

        this.context.translate(
            this.position.x,
            this.position.y + -this.size.height
        );

        this.context.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.context.fillRect(
            -this.size.width / 2,
            0,
            this.size.width,
            healthbarHeight
        );

        this.context.fillStyle = 'rgba(0, 255, 0, 0.5)';
        let healthWidth: number = 0;
        if (this.health > 0) {
            healthWidth = Helpers.mapRange(
                this.health,
                0,
                this.maxHealth,
                0,
                this.size.width
            );
        }

        this.context.fillRect(
            -this.size.width / 2,
            0,
            healthWidth,
            healthbarHeight
        );

        this.context.fillStyle = 'rgb(255, 255, 255)';
        const healthString = (this.health <= 0 ? 0 : this.health).toString();
        this.context.textBaseline = 'middle';
        this.context.textAlign = 'center';
        this.context.font = '14px Arial';
        this.context.fillText(healthString, 0, healthbarHeight / 2 + 1);

        this.context.restore();
    }
}
