import * as fromEngDetail from './eng-reducer';
import {ActionReducerMap, createSelector} from '@ngrx/store';


export interface RootReducerState {
  engDetails: fromEngDetail.EngDetailsReducerState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  engDetails: fromEngDetail.EngDetailReducer,
};

export const getengDetailstate = (state: RootReducerState) => state.engDetails;

export const getEngDetailLoaded = createSelector(getengDetailstate, fromEngDetail.getLoaded);
export const getEngDetailLoading = createSelector(getengDetailstate, fromEngDetail.getLoading);
export const getEngDetailEntities = createSelector(getengDetailstate, fromEngDetail.getEngDetailEntities);
export const getEngDetailError = createSelector(getengDetailstate, fromEngDetail.getError);


