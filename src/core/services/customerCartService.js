import BaseService from "./baseService";
import { customerCartEndpoint } from "../apis/endpoints";

class CustomerCartService extends BaseService {

    constructor() {
        super(customerCartEndpoint);
    }
}

export default new CustomerCartService();