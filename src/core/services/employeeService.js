import BaseService from "./baseService";
import { employeesEndpoint } from "../apis/endpoints";
import { validatePhoneNumber } from "../validations";

class EmployeeService extends BaseService {

    constructor() {
        super(employeesEndpoint);
    }

    /**
     * @param {string} number 
     */
    isValidPhoneNumber(number) {
        return validatePhoneNumber(number);
    }
}

export default new EmployeeService();