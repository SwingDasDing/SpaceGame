import shipsJson from '../assets/JSON/ships.json';
import imagesJson from '../assets/JSON/images.json';

import { resolve } from 'path';
import { Point } from '../classes/point.class';
import { ShipModel } from '../classes/ship-model.class';
import { Size } from '../classes/size.class';

export class AssetPreloader {
    private _ships: ShipModel[] = [];
    private _images: Map<string, HTMLImageElement> = new Map();

    public get ships() {
        return this._ships;
    }
    public get images() {
        return this._images;
    }

    public async load(): Promise<void> {
        await this.loadImages();
        this.loadShips();
        resolve();
    }

    private loadShips() {
        shipsJson.forEach(shipObject => {
            const tempShip = new ShipModel();
            tempShip.name = shipObject.name;
            tempShip.image = this.images.get(shipObject.imageUrl);
            tempShip.health = shipObject.health;
            tempShip.size = new Size(
                shipObject.size.height,
                shipObject.size.width
            );
            tempShip.hitBox = shipObject.hitbox.map(
                point => new Point(point.x, point.y)
            );

            this._ships.push(tempShip);
        });
    }

    private loadImages(): Promise<any[]> {
        const promises: Array<Promise<any>> = [];
        imagesJson.forEach((url: string) => {
            promises.push(
                new Promise<void>(resolve => {
                    const image: HTMLImageElement = new Image(256, 256);
                    image.onload = () => {
                        this._images.set(url, image);
                        resolve();
                    };
                    image.src = url;
                })
            );
        });

        return Promise.all(promises);
    }
}
