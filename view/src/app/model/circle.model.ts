import {Deserializable} from "./deserializable.model";
import {Point} from "./point.model";

export class Circle implements Deserializable {

  center: Point;
  radius: number;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.center = new Point().deserialize(input.center);
    this.radius = input.radius;
    return this;
  }
}
