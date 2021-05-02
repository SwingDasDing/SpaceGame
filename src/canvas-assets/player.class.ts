import { InputHandler } from '../services/input-handler.service';
import { Ship } from './ship.class';
import { Vector2d } from '../classes/vector2d.class';
import { LaserGatling } from './weapons/laser-gatling/laser-gatling.class';
import { Railgun } from './weapons/railgun/railgun.class';
import { Weapon } from './weapons/weapon.class';
import { World } from './world.class';
import { Point } from '../classes/point.class';
import { Size } from '../classes/size.class';
import { ShipModel } from '../classes/ship-model.class';
import { clone } from 'lodash';
import { LaserConstant } from './weapons/laser-constant/laser-constant.class';
import { RocketPod } from './weapons/rocket-pod/rocket-pod.class';

export class Player extends Ship {
    constructor(
        public context: CanvasRenderingContext2D,
        public world: World,
        public position: Point,
        public velocity: Vector2d,
        public size: Size,
        public shipModel: ShipModel,
        public services: any,

        public angle?: number
    ) {
        super(
            context,
            world,
            position,
            velocity,
            size,
            shipModel,
            angle,
            services
        );
    }

    public weaponPrimary: Weapon = new LaserGatling(this.world, this.context);
    public weaponSecondary: Weapon = new Railgun(this.world, this.context);

    public speed = 200;
    public highFriction: boolean = false;
    public defaultFrictionFactor = 0.995;
    public highFrictionFactor = 0.9;

    public draw(): void {
        this.context.save();

        this.context.translate(this.position.x, this.position.y);

        this.context.rotate(this.angle);

        if (this.shipModel.image?.src) {
            this.context.drawImage(
                this.shipModel.image,
                -(this.size.width / 2),
                -(this.size.width / 2),
                this.size.width,
                this.size.height
            );
        }

        this.context.fillStyle = `rgba(255,255,255,1)`;

        this.context.restore();

        this.calculateHitbox();
    }

    update(deltaTime: number): void {
        this.draw();

        this.angle = this.angle;
        this.velocity = this.velocity.multiply(
            this.highFriction
                ? this.highFrictionFactor
                : this.defaultFrictionFactor
        );
        this.applyVelocity(deltaTime);

        if (InputHandler.downKeys.m1) {
            this.weaponPrimary.fire(deltaTime);
        } else {
            this.weaponPrimary.stop();
        }
        if (InputHandler.downKeys.m2) {
            this.weaponSecondary.fire(deltaTime);
        } else {
            this.weaponSecondary.stop();
        }
    }

    public applyVelocity(delta: number): void {
        this.position.x += this.velocity.x * delta * this.speed;
        this.position.y += this.velocity.y * delta * this.speed;
    }

    public calculateHitbox(): void {
        this.hitBox = clone(this.shipModel.hitBox);
        this.hitBox.forEach((point: Point, index: number) => {
            this.hitBox[index] = point
                .offset(this.position)
                .rotate(this.position, -this.angle);
        });

        if (this.world.debugMode) {
            this.context.save();
            this.context.fillStyle = 'rgba(255, 255, 255, 0.2)';
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
}
