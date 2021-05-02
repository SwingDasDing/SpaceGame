// import { Point } from '../classes/point.class';
// import { Vector2d } from '../classes/vector2d.class';
// import { Helpers } from '../services/helpers.service';

// export class Explosion {
//     constructor(
//         public context: CanvasRenderingContext2D,
//         public position: Point,
//         public size: number,
//         public lifetime: number
//     ) {
//         for (let i = 0; i < 100; i++) {
//             this.particles.push(
//                 new Particle(
//                     new Point(0, 0),
//                     Helpers.randomBetween(0, 5),
//                     new Vector2d(
//                         Helpers.randomBetween(-5, 5),
//                         Helpers.randomBetween(-5, 5)
//                     )
//                 )
//             );
//         }
//     }

//     public speed = 100;

//     private particles: Particle[] = [];

//     public draw(): void {
//         this.context.save();
//         this.context.translate(this.position.x, this.position.y);
//         this.context.rotate(0);
//         // this.context.fillRect(0, 0, 10, 10);
//         this.drawLayer1();
//         this.context.restore();
//     }

//     public update(delta: number): void {
//         this.particles.forEach(particle => {
//             particle.position.x += particle.velocity.x * delta * this.speed;
//             particle.position.y += particle.velocity.y * delta * this.speed;
//         });
//         this.draw();
//     }

//     public drawLayer1(): void {
//         this.context.fillStyle = 'rgb(255,110,0)';

//         this.particles.forEach(particle => {
//             this.context.beginPath();
//             this.context.arc(
//                 particle.position.x,
//                 particle.position.y,
//                 particle.size,
//                 0,
//                 360
//             );
//             this.context.fill();
//         });
//     }
// }

// export class Particle {
//     constructor(
//         public position: Point,
//         public size: number,
//         public velocity: Vector2d
//     ) {}
// }
