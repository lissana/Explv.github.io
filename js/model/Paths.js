'use strict';

import {Position} from './Position.js';
import {Path} from './Path.js';

export class Paths {
    constructor(map) {
        this.map = map;
        this.curpath = undefined;
        this.featureGroup = new L.FeatureGroup();
        this.paths = [];
        this.addPath();
    }

    addPath() {
        this.curpath = new Path(this.map, this.featureGroup);
        this.paths.push(this.curpath);
    }

    add(position) {
        this.curpath.add(position);
    }

    removeLast() {
        this.curpath.removeLast();
    }

    removeAll() {
        while (this.paths.length > 0) this.paths.pop().removeAll();

        this.paths = [];
        this.addPath();
    }

    createPolyline(startPosition, endPosition) {
        return L.polyline([startPosition.toCentreLatLng(this.map), endPosition.toCentreLatLng(this.map)], {clickable: false});
    }

}