import BaseService from "./baseService";
import { customerOrdersEndpoint } from "../apis/endpoints";

class CustomerOrderService extends BaseService {

    constructor() {
        super(customerOrdersEndpoint);
    }
}

export default new CustomerOrderService();