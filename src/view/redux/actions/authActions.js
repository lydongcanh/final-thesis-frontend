import { ACCOUNT_LOGIN, ACCOUNT_LOGOUT } from "./actionTypes";

export const login = (username, password) => ({
    type: ACCOUNT_LOGIN,
    payload: { username, password }
});

export const logout = () => ({
    type: ACCOUNT_LOGOUT
});