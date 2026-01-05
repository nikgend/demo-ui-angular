import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { EngDetailReducer } from "./reducers/eng-reducer";

export interface RootState {
  count: any
}

export const reducers: ActionReducerMap<RootState> = {
  count: EngDetailReducer
}

export const metaReducers: MetaReducer[] = [
]