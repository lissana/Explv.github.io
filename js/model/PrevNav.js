'use strict';

import {Position} from './Position.js';
import {Area} from './Area.js';

class PrevNav {

    constructor() {
        this.nodes = [];
        this.conns = [];
    }

    getLocations(callback) {
        if (this.nodes.length > 0) {
            callback(this.nodes, this.conns);
            return;
        }

        $.ajax({
            url: "resources/wps.json",
            dataType: "json",
            context: this,
            success: function( data ) {
                var locations = data["nodes"];
                var conns = data["conns"];

                var posPattern = `(Position|WebNode_Point|WebNode_[^()]+)+\\(([^)]*)\\)`;
                var re = new RegExp(posPattern, "mg");

                for (var i in locations) {

                    var pos = undefined;
                    var area = undefined;
                    var type = undefined;
                    var match;
                    while ((match = re.exec(locations[i].value))) {
                        var values = match[2].split(",");
                        type = match[1];
                        if (match[1] === "WebNode_Area") {
                            console.log("area " + values);
                            var pos1 = new Position(values[0], values[1], 0);
                            var pos2 = new Position(values[2], values[3], 0);
                            var midx = (Math.floor(values[0]) + Math.floor(values[2])) / 2
                            var midy = (Math.floor(values[1]) + Math.floor(values[3])) / 2
                            pos = new Position(midx, midy, 0);
                            area = new Area(pos1, pos2, 0);
                        } else if (match[1] == "WebNode_IfExists") {
                            pos = new Position(values[0], values[1], values[3]);
                        } else {
                            pos = new Position(values[0], values[1], values[2]);
                        }
                    }

                    this.nodes.push({
                        "index": locations[i].index,
                        "position": pos,
                        "area": area,
                        "type": type,
                        "value": locations[i].value,
                    });
                }

                for (var i in conns) {

                    this.conns.push({
                        "src": conns[i].index,
                        "dst": conns[i].value,
                    });

                }

                callback(this.nodes, this.conns);
            }
        });
    }
}

export default (new PrevNav);
