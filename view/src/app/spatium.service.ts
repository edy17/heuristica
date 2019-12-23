import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Point} from "./model/point.model";

@Injectable({
  providedIn: 'root'
})
export class SpatiumService {

  constructor(private httpClient: HttpClient, @Inject('BACKEND_API_URL') public host: string) {
  }

  public getPoints(url): Observable<Array<Point>> {
    return this.httpClient.get<Array<Point>>(url).pipe(
      map(data => data.map(point => new Point().deserialize(point))),
      catchError(() => throwError('Points not found'))
    );
  }
}
