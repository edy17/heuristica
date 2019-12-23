import {Deserializable} from "./deserializable.model";

export class Point implements Deserializable {

  x: number;
  y: number;

  deserialize(input: any): this {
    return Object.assign(this, input);
  }
}
