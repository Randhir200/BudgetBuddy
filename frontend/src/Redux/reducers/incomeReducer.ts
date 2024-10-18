const initialState:any = {
    incomeData: [],
    isLoading: false,
    error: '',
};
const incomeReducer = (state=initialState, action:any)=>{
    switch(action.type) {
        case 'add': {
            return {...state, incomeData: [...state.incomeData, action.payload]}
        }
        case 'get': {
            return state
        }
        default : {
            return state
        }
    }
}

export default incomeReducer;