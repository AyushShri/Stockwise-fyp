import { SET_STOCK_DATA, SET_STOCK_STATE } from "../../store/actionsConstants"


const initialState = {
    stockData: [],
    stockState:false
}

const dashboardReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_STOCK_DATA: {
            return {...state, stockData: action.payload}
        }
        case SET_STOCK_STATE: {
            return {...state, stockState: action.payload}
        }
        default:
            return state;
    }
}

export default dashboardReducer;