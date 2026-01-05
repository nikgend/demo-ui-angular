import {Action} from '../actions';
import { ENGDETAILS_LIST_REQUEST, ENGDETAILS_UPDATE, ENGDETAILS_LIST_ERROR, ENGDETAILS_LIST_SUCCESS } from '../actions/eng-actions';
import { EngdetailsModel } from '../models/engDetails';

export interface EngDetailsReducerState {
  loading: boolean;
  loaded: boolean;
  error: boolean;
  entities: { [id: number]: EngdetailsModel };
}

const initialState: EngDetailsReducerState = {
  loaded: false,
  loading: false,
  error: false,
  entities: {},
};

export function EngDetailReducer(state = initialState, action: Action): EngDetailsReducerState {
  switch (action.type) {
    case ENGDETAILS_LIST_REQUEST: {
      return {...state}; 
    }
    case ENGDETAILS_UPDATE: {
      const entity = action.payload.data;
      const updatedEntities = {...state.entities, ...entity};
      sessionStorage.setItem("engDetails", JSON.stringify(action.payload.data))
      return {...state, ...{entities: updatedEntities}};
    }

    case ENGDETAILS_LIST_ERROR: {
      return {...state, error: true, loading: false};
    }
    default: {
      return state;
    }
  }
}

// selectors
export const getLoading = (state: EngDetailsReducerState) => { return state.loading };
export const getLoaded = (state: EngDetailsReducerState) => { return state.loaded };
export const getEngDetailEntities = (state: EngDetailsReducerState) => { return state.entities };
export const getError = (state: EngDetailsReducerState) => { return state.error };