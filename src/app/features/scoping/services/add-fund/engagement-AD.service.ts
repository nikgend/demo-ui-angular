import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';

@Injectable({
  providedIn: 'root'
})
export class EngagementADService extends CommonApiService<any> {

  constructor(http: HttpClient) {
    super(http);
  }

  getResourceUrl() {
    return 'scoping/ActiveDirectoryAllUsers'
  }

  getActiveDirectoryAllUsersData(filterName: string) {
    return this.getAllActiveDirectoryAllUsers(filterName);
  }
}