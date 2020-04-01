import BaseService from "./baseService";
import { customerOrderDetailsEndpoint } from "../apis/endpoints";

class CustomerOrderDetailsService extends BaseService {

    constructor() {
        super(customerOrderDetailsEndpoint);
    }
}

export default new CustomerOrderDetailsService();