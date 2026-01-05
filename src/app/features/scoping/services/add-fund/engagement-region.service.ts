import { Injectable } from '@angular/core';
import { EnvService } from 'src/app/shared/services/env-service/env.service';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export  class EngagementRegionService<T>  {
  private APIUrl = "";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  textHeader = new HttpHeaders().set('Content-Type', 'text/plain;charset=utf-8');
  public tokenHeader!: HttpHeaders;

  constructor(protected httpClient: HttpClient) {
    this.APIUrl = EnvService.apiURL + this.getResourceUrl();
  }

  getResourceUrl() {
    return 'engagement/RegionAll'
  }

  getAllRegion(): Observable<T> {
    //should be uncommented below line after deploying API code into dev
    return this.httpClient.get<T[]>(`${this.APIUrl}`, { headers: this.headers })
    .pipe(
      map(response => response['data']
        //.filter(region => region.regionName === "United States")
        ),
      catchError(this.handleError)
    );
}
  
  fromServerModel(json: any): any {
    return json;
  }

  private handleError(error: HttpErrorResponse) {
    // Handle the HTTP error here
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error.error);
  }
}
