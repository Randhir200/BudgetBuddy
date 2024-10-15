import axios from 'axios';
import { Dispatch } from 'redux';
import {
    FETCH_INCOME_REQUEST,
    FETCH_INCOME_SUCCESS,
    FETCH_INCOME_FAILURE,
    IncomeActionTypes
} from './incomeTypes';
import { budgetBuddyApiUrl } from '../../config/config';

interface FetchIncomeRequestAction {
    type: typeof FETCH_INCOME_REQUEST;
}

interface FetchIncomeSuccessAction {
    type: typeof FETCH_INCOME_SUCCESS;
    payload: any; // Replace `any` with the actual type of Income data you expect
}

interface FetchIncomeFailureAction {
    type: typeof FETCH_INCOME_FAILURE;
    payload: string; // Error message
}

export type IncomeActions =
    | FetchIncomeRequestAction
    | FetchIncomeSuccessAction
    | FetchIncomeFailureAction;



export const fetchIncomeRequest = (): FetchIncomeRequestAction => ({
    type: FETCH_INCOME_REQUEST,
});

export const fetchIncomeSuccess = (incomeData: any): FetchIncomeSuccessAction => ({
    type: FETCH_INCOME_SUCCESS,
    payload: incomeData,
});

export const fetchIncomeFailure = (error: string): FetchIncomeFailureAction => ({
    type: FETCH_INCOME_FAILURE,
    payload: error,
});

export const incomeActions = () => {
    return async (dispatch: Dispatch<IncomeActions>) => {
        dispatch(fetchIncomeRequest())
        try {
            const response = await axios.get(`${budgetBuddyApiUrl}/expense/getAllExpense?userId=6638bbb72ee0057ac3f3e21a`);
            dispatch(fetchIncomeSuccess(response.data));
        } catch(err:any) {
            dispatch(fetchIncomeFailure(err.message));
        }
    }
}



