import {Deserializable} from "./deserializable.model";
import {Point} from "./point.model";

export class DetailedPoints implements Deserializable {

  sessionUUID: string;
  randomPoints: Array<Point>;

  deserialize(input: any): this {
    this.sessionUUID = input.sessionUUID;
    this.randomPoints = input.randomPoints.map(p => new Point().deserialize(p));
    return this;
  }
}
