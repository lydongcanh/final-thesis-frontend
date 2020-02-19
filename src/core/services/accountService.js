import BaseService from "./baseService";
import { accountsEndpoint } from "../apis/endpoints";
import { validateUsername, validatePassword } from "../validations";
import { Texts } from "../texts";

const ACCOUNT_TYPES = {
    Admin: "Admin",
    Customer: "Customer",
    Employee: "Employee"
};

class AccountService extends BaseService {

    constructor() {
        super(accountsEndpoint);
    }

    async customerSignup(username, password) {
        return await this.createNewAccount(username, password, ACCOUNT_TYPES.Customer);
    }

    async createNewAccount(username, password, accountType, isActive = true) {
        const checkUsername = await this.isValidUsername(username);
        if (checkUsername.error)
            return checkUsername;

        const checkPassword = await this.isValidPassword(password);
        if (checkPassword.error)
            return checkPassword;

        return await this.create({
            username: username,
            password: password,
            accountType: accountType,
            isActive: isActive
        });
    }

    /**
     * @param {string} username 
     */
    async isValidUsername(username) {
        if (!validateUsername(username))
            return { error: Texts.INVALID_USERNAME };

        const existAccount = await this.query({ username: username });
        if (existAccount.data.length > 0)
            return { error: Texts.USERNAME_ALREADY_EXISTS };

        return { username: username }
    }

    /**
     * @param {string} password 
     */
    async isValidPassword(password) {
        if (!validatePassword(password))
            return { error: Texts.INVALID_PASSWORD };

        return { password: password }
    }
}

export default new AccountService();