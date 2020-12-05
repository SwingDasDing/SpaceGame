import { DownKeys } from '../classes/down-keys.class';
import { Point } from '../classes/point.class';
import { Keys } from '../enums/keys.enum';

export class InputHandler {
    public static downKeys: DownKeys = new DownKeys();
    public static mousePosition: Point = new Point(0, 0);

    public static init() {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.mousePosition = new Point(event.x, event.y);
        });

        window.addEventListener('mousedown', (event: MouseEvent) => {
            this.downKeys.m1 = true;
        });

        window.addEventListener('mouseup', (event: MouseEvent) => {
            this.downKeys.m1 = false;
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
    }
}
