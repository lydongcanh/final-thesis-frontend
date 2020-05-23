import { customerOrderStateDetailsEndpoint } from "../apis/endpoints";
import BaseService from "./baseService";

class CustomerOrderStateDetailsService extends BaseService {

    constructor() {
        super(customerOrderStateDetailsEndpoint);
    }

    async getByOrderId(orderId) {
        return await super.query({
            customerOrderId: orderId
        });
    }

    async getByEmployeeId(employeeId) {
        return await super.query({
            employeeId: employeeId
        });
    }
}

export default new CustomerOrderStateDetailsService();