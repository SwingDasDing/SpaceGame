import { uniqueId } from 'lodash';
import { Point } from './point.class';
import { Size } from './size.class';

export class ShipModel {
    public id = uniqueId();
    constructor() {}
    public name: string;
    public image: HTMLImageElement;
    public size: Size;
    public hitBox: Point[];
    public health: number;
    public detectionRange: number;
}
