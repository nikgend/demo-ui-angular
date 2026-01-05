import {Httpclient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CommonApiService} from 'src/app/core/services/CommonService/CommonApiService';

@Injectable({
  providedIn: 'root',
})
export class CommonFundSelectionService extends CommonApiService<any> {
    private sourceTableReportDataList: any;

    getResourceUrl(): string {
        return 'scoping/fundgroups';
    }

    constructor(protected http: Httpclient) {
        super(http);
    }

    
}