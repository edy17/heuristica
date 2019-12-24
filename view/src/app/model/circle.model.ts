import {Deserializable} from "./deserializable.model";
import {Point} from "./point.model";
import {Line} from "./line.model";

export class Circle implements Deserializable {

  center: Point;
  diameter: Line;

  deserialize(input: any): this {
    this.center = new Point().deserialize(input.center);
    this.diameter = new Line().deserialize(input.diameter);
    return this;
  }
}
