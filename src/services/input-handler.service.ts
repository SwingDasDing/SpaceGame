import { DownKeys } from '../classes/down-keys.class';
import { Point } from '../classes/point.class';
import { World } from '../classes/world.class';
import { Keys } from '../enums/keys.enum';
import { MouseButtons } from '../enums/mouse-buttons.enum';

export class InputHandler {
    public static downKeys: DownKeys = new DownKeys();
    public static mousePosition: Point = new Point(0, 0);

    public static init(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D
    ) {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.mousePosition = new Point(event.x, event.y);
        });

        window.addEventListener('mousedown', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            switch (event.button) {
                case MouseButtons.Left:
                    this.downKeys.m1 = true;
                    break;

                case MouseButtons.Right:
                    this.downKeys.m2 = true;
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('mouseup', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            switch (event.button) {
                case MouseButtons.Left:
                    this.downKeys.m1 = false;
                    break;

                case MouseButtons.Right:
                    this.downKeys.m2 = false;
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('keydown', (event: KeyboardEvent) => {
            // console.log(event)
            switch (event.key) {
                case Keys.W:
                    this.downKeys.w = true;
                    break;

                case Keys.S:
                    this.downKeys.s = true;
                    break;

                case Keys.D:
                    this.downKeys.d = true;
                    break;

                case Keys.A:
                    this.downKeys.a = true;
                    break;

                case Keys.Space:
                    this.downKeys.space = true;
                    break;

                default:
                    break;
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            switch (event.key) {
                case Keys.W:
                    this.downKeys.w = false;
                    break;

                case Keys.S:
                    this.downKeys.s = false;
                    break;

                case Keys.D:
                    this.downKeys.d = false;
                    break;

                case Keys.A:
                    this.downKeys.a = false;
                    break;

                case Keys.Space:
                    this.downKeys.space = false;
                    break;

                default:
                    break;
            }
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            context.translate(canvas.width / 2, canvas.height / 2);
        });
    }

    public static handleVelocity(world: World) {
        const acceleration = 0.1;
        if (InputHandler.downKeys.w) {
            world.player.velocity.y -= acceleration;
        }
        if (InputHandler.downKeys.s) {
            world.player.velocity.y += acceleration;
        }
        if (InputHandler.downKeys.a) {
            world.player.velocity.x -= acceleration;
        }
        if (InputHandler.downKeys.d) {
            world.player.velocity.x += acceleration;
        }

        world.player.highFriction = InputHandler.downKeys.space;
    }
}
