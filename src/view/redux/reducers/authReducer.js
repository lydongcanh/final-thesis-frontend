import { ACCOUNT_LOGIN, ACCOUNT_LOGOUT } from "../actions/actionTypes";

const initialState = {
    account: null,
    /** Check if user has logged in in this section. */
    loggedIn: false,
    /** Check if the account should be persisted between sections. */
    persistAccount: false
};

export default function (state = initialState, action) {
    switch(action.type) {
        case ACCOUNT_LOGIN: {
            const { account, persistAccount } = action.payload;
            return {
                ...state,
                loggedIn: true,
                persistAccount: persistAccount,
                account: account
            }
        }
        case ACCOUNT_LOGOUT: {
            return {
                ...state,
                loggedIn: false,
                persistAccount: false,
                account: null
            }
        }
        default: return state;
    }
};