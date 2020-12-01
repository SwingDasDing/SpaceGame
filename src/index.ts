import * as _ from "lodash";
import { DownKeys } from './classes/down-keys.class';

import { Player } from './classes/player.class';
import { Point } from './classes/point.class';
import { Projectile } from './classes/projectile.class';
import { Size } from './classes/size.class';
import { Star } from './classes/star.class';
import { Vector2d } from './classes/vector2d.class';
import { Keys } from './enums/keys.enum';

class Main {
  private canvas: HTMLCanvasElement;
  private fpsCounterEl: HTMLSpanElement;
  private context: CanvasRenderingContext2D;
  private rAF: number = 0; // ms
  private deltaTime: number = 0; // ms
  private fpsVal: number = 0;
  private player: Player;
  private downKeys: DownKeys = new DownKeys();
  private projectiles: Projectile[] = [];
  private stars: Star[] = [];



  constructor(){
    this.canvas = document.querySelector('#canvasEl');
    this.fpsCounterEl = document.querySelector('#fpsCounterEl');    
  }

  public init(): void {
    this.context = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.context.fillStyle = this.context.strokeStyle = 'white';

    this.generateStars();
    this.countFps();

    const initialPosition = new Point(0,0);
    const initialVelocity = new Vector2d(0,0);
    const initialSize = new Size(60,40);
    

    this.player = new Player(this.context, initialPosition, initialVelocity, initialSize, 0)

    this.animate();

    window.addEventListener('mousemove', (event: MouseEvent) => {
      this.player.angle = Math.atan2(this.player.position.y - event.y + this.canvas.height / 2, this.player.position.x - event.x + this.canvas.width / 2) -  Math.PI / 2;
    })

    window.addEventListener('click', (event: MouseEvent) => {
      const vX = Math.cos(this.player.angle - Math.PI / 2);
      const vY = Math.sin(this.player.angle - Math.PI / 2);
      const velocity = new Vector2d(vX,vY).multiply(5);
      const p: Projectile = new Projectile(this.context, _.clone(this.player.position), velocity, this.player.angle, 5, this.player.velocity);
      this.projectiles.push(p);
    })

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // console.log(event)
      switch (event.key) {
        case Keys.W:
          this.downKeys.w = true
          break;

        case Keys.S:
          this.downKeys.s = true
          break;

        case Keys.D:
          this.downKeys.d = true
          break;
          
        case Keys.A:
          this.downKeys.a = true
          break;

          case Keys.Space:
            this.downKeys.space = true
            break;
      
        default:
          break;
      }
    })

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.key) {
        case Keys.W:
          this.downKeys.w = false
          break;

        case Keys.S:
          this.downKeys.s = false
          break;

        case Keys.D:
          this.downKeys.d = false
          break;
          
        case Keys.A:
          this.downKeys.a = false
          break;

          case Keys.Space:
            this.downKeys.space = false
            break;
      
        default:
          break;
      }
    })

    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    })
  }


  public animate(): void{  
    this.fpsVal++

    this.context.fillStyle = 'rgba(0,0,0,0.2)';
    this.rAF = window.requestAnimationFrame(() =>  this.animate())


    
    this.context.fillRect(-this.canvas.clientWidth / 2, -this.canvas.clientHeight / 2, this.canvas.clientWidth, this.canvas.clientHeight)



    this.handleVelocity();


    this.player.update();

    this.projectiles.forEach((p, index) => {
      p.update();
      if (p.dead){
        this.projectiles.splice(index, 1)
      }
    })

    this.stars.forEach((s, index) => {
      s.update();
    })
  }

  private handleVelocity(){
    const acceleration = 0.1;
    if (this.downKeys.w){
      this.player.velocity.y -= acceleration;
    }
    if (this.downKeys.s){
      this.player.velocity.y += acceleration;
    }
    if (this.downKeys.a){
      this.player.velocity.x -= acceleration;
    }
    if (this.downKeys.d){
      this.player.velocity.x += acceleration;
    }

    this.player.highFriction = this.downKeys.space;
  }

  private generateStars(): void {
    for (let index = 0; index < 200; index++) {
      const pos = new Point((this.randomBetween(-this.canvas.width / 2, -this.canvas.width / 2)), (this.randomBetween(-this.canvas.height / 2, -this.canvas.height / 2)))
      this.stars.push(new Star(this.context, pos, this.randomBetween(0,3) ,Math.random()));
    }
  }

  private countFps(): void{
    setInterval(() => {
      this.fpsCounterEl.innerHTML = this.fpsVal.toString();
      this.fpsVal = 0
    }, 1000);
  }



  private randomBetween(min: number, max:number): number{
    return Math.floor(Math.random() * (max + min)) - min;
  }
}






const app = new Main()
app.init()
