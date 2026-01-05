import { Injectable } from '@angular/core';
import { CommonApiService } from 'src/app/core/services/CommonService/CommonApiSevice';
import { HttpClient, HttpParams } from '@angular/common/http';
import { search } from '@syncfusion/ej2/filemanager';

@Injectable({
  providedIn: 'root'
})
export class ViewEngagementService extends CommonApiService<any> {

  constructor(private http: HttpClient) {
    super(http);
  }

  getResourceUrl() {
    return 'engagement/Get'
  }
  getEngagementList(id: any, searchKey: any, clientId: any) {
    // return this.getAllEngagements();
    if (id == '' || id == null) {
      id = 0;
    }
    if (searchKey == '' || searchKey == null) {
      searchKey = null;
    }

    return this.getAllEngagements(id, searchKey, clientId);
  }

  getAcUAEngagementList() {

    return this.getAcUAAllEngagements();
  }
  getUserList(id: any, searchKey: any, clientId: any) {
    // return this.getAllEngagements();
    if (id == '' || id == null) {
      id = 0;
    }
    if (searchKey == '' || searchKey == null) {
      searchKey = null;
    }

    return this.getAllUsers(id, searchKey, clientId);
  }

  getManageSearchByEngagement(engId: any) {
    return this.getManageSearchByEngagementList(engId);
  }

  getSearchByUser() {
    return this.getSearchByUserList();
  }

  getAllAcEngagements() {
    return this.getAllAcSearchEngagementList();
  }

  getAdminMembers() {
    return this.getAdminMembersList();
  }

  getManageUserData(id: any) {
    return this.getManageUserDataList(id);
  }

  deleteManageMemberWithEngagement(memberDetails: any) {
    return this.deleteManageMemberByEngagement(memberDetails);
  }

  deleteManageUserEngagement(deleteUser: any) {
    return this.deleteManageUserbyEngagement(deleteUser);
  }

  toggleManageMemberStatus(reqChanges: any) {
    return this.toggleManageMemberStatusEng(reqChanges);
  }

  toggleManageUserEngagement(requiredChanges: any) {
    return this.toggleManageIndividualEngagement(requiredChanges);
  }

  //add team member in AC search by engagement
  addTeammemberEng(memberDetail: any) {
    return this.addingTeamMemberEng(memberDetail);
  }

  //add admin team member in AC admin user
  addAdminTeamMember(arrayForAdmin: any) {
    return this.addingAdminTeamMember(arrayForAdmin);
  }

  deleteAdminUsername(adminMemberId: any) {
    return this.isDeleteUserAdminAccess(adminMemberId);
  }

  saveAdminUserRegions(regionDTO: any) {
    return this.saveAdminUserRegionList(regionDTO);
  }

  getRollFowrardEngagementStatus(pollingCount: number) {
    return this.getRollFowrardEngagementStatusList(pollingCount);
  }

  updateEngagementStatus(existingEngagementData: any, updatedEngagemetData: any): string {
    let existingEngagementParsedObj: any = {};
    existingEngagementParsedObj = JSON.parse(existingEngagementData);
    existingEngagementParsedObj.engStatus = updatedEngagemetData.data[0].engagementStatus;
    return JSON.stringify(existingEngagementParsedObj);
  }
}
