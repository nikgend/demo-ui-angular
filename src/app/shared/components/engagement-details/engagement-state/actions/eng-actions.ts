import { createAction, props } from '@ngrx/store';
import { EngdetailsModel } from '../models/engDetails';

export const ENGDETAILS_UPDATE = '[Engagement Details] Update';
export const ENGDETAILS_LOAD = '[Engagement Details] Load';
export const ENGDETAILS_LOAD_SUCCESS = '[Engagement Details] Load Success';
export const ENGDETAILS_LOAD_FAILURE = '[Engagement Details] Load Failure';

export const updateEngDetails = createAction(
  ENGDETAILS_UPDATE,
  props<{ data: EngdetailsModel }>()
);

export const loadEngDetails = createAction(
  ENGDETAILS_LOAD
);

export const loadEngDetailsSuccess = createAction(
  ENGDETAILS_LOAD_SUCCESS,
  props<{ data: EngdetailsModel }>()
);

export const loadEngDetailsFailure = createAction(
  ENGDETAILS_LOAD_FAILURE,
  props<{ error: string }>()
);
