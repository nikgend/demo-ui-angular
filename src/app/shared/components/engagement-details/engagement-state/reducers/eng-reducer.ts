import { createReducer, on } from '@ngrx/store';
import { EngagementDetailsState, EngdetailsModel } from '../models/engDetails';
import * as EngActions from '../actions/eng-actions';

export const initialState: EngagementDetailsState = {
  entities: null,
  loading: false,
  error: null
};

export const engDetailReducer = createReducer(
  initialState,
  on(EngActions.loadEngDetails, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EngActions.updateEngDetails, (state, { data }) => {
    sessionStorage.setItem("engDetails", JSON.stringify(data));
    return {
      ...state,
      entities: data,
      loading: false,
      error: null
    };
  }),
  on(EngActions.loadEngDetailsSuccess, (state, { data }) => {
    sessionStorage.setItem("engDetails", JSON.stringify(data));
    return {
      ...state,
      entities: data,
      loading: false,
      error: null
    };
  }),
  on(EngActions.loadEngDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function reducer(state: EngagementDetailsState | undefined, action: any) {
  return engDetailReducer(state, action);
}
