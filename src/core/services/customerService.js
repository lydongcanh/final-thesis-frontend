import BaseService from "./baseService";
import {customersEndpoint} from "../apis/endpoints";

class CustomerService extends BaseService {

    constructor() {
        super(customersEndpoint);
    }
}

export default new CustomerService();