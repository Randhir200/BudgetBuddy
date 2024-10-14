import axios from 'axios';
import {
    FETCH_INCOME_REQUEST,
    FETCH_INCOME_SUCCESS,
    FETCH_INCOME_FAILURE
} from './incomeTypes';
import { budgetBuddyApiUrl } from '../../config/config';

export const incomeActions = (userId: string) => {
    return async (dispatch: any) => {
        dispatch({ type: FETCH_INCOME_REQUEST })
        try {
            const response = await axios.get(`${budgetBuddyApiUrl}/expense/getAllExpense?userId=${userId}`);
            dispatch({ type: FETCH_INCOME_SUCCESS, payload: response.data });
        } catch(err) {
            dispatch({type:FETCH_INCOME_FAILURE, payload: err});
        }
    }
}



