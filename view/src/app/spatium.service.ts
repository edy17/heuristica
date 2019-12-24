import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {DetailedPoints} from "./model/detailedPoints.model";
import {Point} from "./model/point.model";
import {Circle} from "./model/circle.model";

@Injectable({
  providedIn: 'root'
})
export class SpatiumService {

  constructor(private httpClient: HttpClient, @Inject('BACKEND_API_URL') public host: string) {
  }

  public getDetailedPoints(url): Observable<DetailedPoints> {
    return this.httpClient.get<DetailedPoints>(url).pipe(
      map(data => new DetailedPoints().deserialize(data)),
      catchError(() => throwError('DetailedPoints not found'))
    );
  }

  public getPoints(url): Observable<Array<Point>> {
    return this.httpClient.get<Array<Point>>(url).pipe(
      map(data => data.map(point => new Point().deserialize(point))),
      catchError(() => throwError('Points not found'))
    );
  }

  public getCircle(url): Observable<Circle> {
    return this.httpClient.get<Circle>(url).pipe(
      map(data => new Circle().deserialize(data)),
      catchError(() => throwError('Circle not found'))
    );
  }
}
