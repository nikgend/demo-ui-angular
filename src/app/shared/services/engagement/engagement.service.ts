import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EngdetailsModel } from '../../components/engagement-details/engagement-state/models/engDetails';
import { EnvService } from '../env-service/env.service';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {
  constructor(private http: HttpClient) {}

  // Get all engagements from https://localhost:44351/api/engagement
  getEngagements(): Observable<EngdetailsModel[]> {
    const apiUrl = `${EnvService.apiURL}/api/engagement`;
    return this.http.get<EngdetailsModel[]>(apiUrl);
  }

  // Get engagement by ID
  getEngagementById(engagementId: number): Observable<EngdetailsModel> {
    const apiUrl = `${EnvService.apiURL}/api/engagement/${engagementId}`;
    return this.http.get<EngdetailsModel>(apiUrl);
  }

  // Delete engagement by ID
  deleteEngagement(engagementId: number): Observable<any> {
    const apiUrl = `${EnvService.apiURL}/api/engagement/${engagementId}`;
    return this.http.delete(apiUrl);
  }
}

