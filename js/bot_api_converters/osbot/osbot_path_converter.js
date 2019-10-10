'use strict';

import {Position} from '../../model/Position.js';
import {Path} from '../../model/Path.js';
import {OSBotConverter} from './osbot_converter.js';

export class OSBotPathConverter extends OSBotConverter {

    
    /*
    API Doc:
        https://osbot.org/api/org/osbot/rs07/api/map/Position.html
        
        Position(int x, int y, int z)
    */
    fromJava(text, path) {
        console.log("fromJava");
        path.removeAll();

        var groupRe = new RegExp(`\\[([^\\]]*)\\]`, "mg");
        var g;
        while ((g = groupRe.exec(text))) {

            var gtext = g[1].replace(/\s/g, '');
            var posPattern = `new(Position|WebNode_Point|WebNode_IfExists)+\\(([^)]*)\\)`;
            var re = new RegExp(posPattern, "mg");
            var match;
            while ((match = re.exec(gtext))) {
                if (match[1] == "WebNode_IfExists") {
                    var values = match[2].split(",");
                    path.add(new Position(values[0], values[1], values[3]));
                } else {
                    var values = match[2].split(",");
                    path.add(new Position(values[0], values[1], values[2]));
                }
            }

            path.addPath();
        }
    }
    
    toRaw(path) {
        var output = "";
        for (var i = 0; i < path.positions.length; i++) {
            output += `${path.positions[i].x},${path.positions[i].y},${path.positions[i].z}\n`;
        }
        return output;
    }
    
    toJavaSingle(position) {
        return `${this.javaPosition} position = new ${this.javaPosition}(${position.x}, ${position.y}, ${position.z});`;
    }
    
    toJavaArray(apath) {
        var output = "";
        for(var p=0; p<apath.paths.length; p++) {
            var path = apath.paths[p];
            if (path.positions.length == 1) {
                output += this.toJavaSingle(path.positions[0]);
            } else if (path.positions.length > 1) {
                output += `[\n`;
                for (var i = 0; i < path.positions.length; i++) {
                    output += `    new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z})`;
                    if (i != path.positions.length - 1) output += ",";
                    output += "\n";
                }
                output += "]\n";
            }
            output += "\n";
        }
        return output;
    }
    
    toJavaList(path) {
        if (path.positions.length == 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            var output = `List&lt;${this.javaPosition}&gt; path = new ArrayList<>();\n`;
            for (var i = 0; i < path.positions.length; i++) {
                output += `path.add(new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z}));\n`;
            }
            return output;
        }
        return "";
    }
    
    toJavaArraysAsList(path) {
        if (path.positions.length == 1) {
            return this.toJavaSingle(path.positions[0]);
        } else if (path.positions.length > 1) {
            var output = `List&lt;${this.javaPosition}&gt; path = Arrays.asList(\n    new ${this.javaPosition}[]{\n`;
            for (var i = 0; i < path.positions.length; i++) {
                output += `        new ${this.javaPosition}(${path.positions[i].x}, ${path.positions[i].y}, ${path.positions[i].z})`;
                if (i != path.positions.length - 1) output += ",";
                output += "\n";
            }
            output += "    }\n);";
            return output;
        }
        return "";
    }
}