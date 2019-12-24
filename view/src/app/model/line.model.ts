import {Deserializable} from "./deserializable.model";
import {Point} from "./point.model";

export class Line implements Deserializable {

  p: Point;
  q: Point;

  deserialize(input: any): this {
    this.p = new Point().deserialize(input.p);
    this.q = new Point().deserialize(input.q)
    return this;
  }
}
