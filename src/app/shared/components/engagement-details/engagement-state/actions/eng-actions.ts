import {EngdetailsModel} from '../models/engDetails';

export const ENGDETAILS_LIST_REQUEST = 'EngDetails list request';
export const ENGDETAILS_LIST_SUCCESS = 'EngDetails list success';
export const ENGDETAILS_UPDATE = 'EngDetails update';
export const ENGDETAILS_LIST_ERROR = 'EngDetails list error';

export class EngDetailsListRequestAction {
  readonly type = ENGDETAILS_LIST_REQUEST;
}
export class EngDetailsUpdateAction {
  readonly type = ENGDETAILS_UPDATE;

  constructor(public payload?: { data: EngdetailsModel }) {
  }
}
export class EngDetailsListErrorAction {
  readonly type = ENGDETAILS_LIST_ERROR;
}

export class EngDetailsListSuccessAction {
  readonly type = ENGDETAILS_LIST_SUCCESS;

  constructor(public payload?: { data: EngdetailsModel[] }) {
  }
}