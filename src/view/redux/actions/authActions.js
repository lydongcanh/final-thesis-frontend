import { ACCOUNT_LOGIN, ACCOUNT_LOGOUT } from "./actionTypes";

/**
 * @param {boolean} persistAccount Should the account be persisted between sections?
 */
export const login = (account, persistAccount) => ({
    type: ACCOUNT_LOGIN,
    payload: { account, persistAccount }
});

export const logout = () => ({
    type: ACCOUNT_LOGOUT
});