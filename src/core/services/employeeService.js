import BaseService from "./baseService";
import { employeesEndpoint } from "../apis/endpoints";

class EmployeeService extends BaseService {

    constructor() {
        super(employeesEndpoint);
    }
}

export default new EmployeeService();