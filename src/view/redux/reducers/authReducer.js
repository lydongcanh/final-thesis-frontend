import { ACCOUNT_LOGIN, ACCOUNT_LOGOUT } from "../actions/actionTypes";

const initialState = {
    loggedIn: false,
    username: null,
    password: null
};

export default function (state = initialState, action) {
    switch(action.type) {
        case ACCOUNT_LOGIN: {
            const { username, password } = action.payload;
            return {
                ...state,
                loggedIn: true,
                username: username,
                password: password
            }
        }
        case ACCOUNT_LOGOUT: {
            return {
                ...state,
                loggedIn: false,
                username: null,
                password: null
            }
        }
        default: return state;
    }
};