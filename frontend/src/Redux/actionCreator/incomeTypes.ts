export const FETCH_INCOME_REQUEST = 'FETCH_INCOME_REQUEST';
export const FETCH_INCOME_SUCCESS = 'FETCH_INCOME_SUCCESS';
export const FETCH_INCOME_FAILURE = 'FETCH_INCOME_FAILURE';


export type IncomeActionTypes =
  | typeof FETCH_INCOME_REQUEST
  | typeof FETCH_INCOME_SUCCESS
  | typeof FETCH_INCOME_FAILURE;