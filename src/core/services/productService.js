import BaseService from "./baseService";
import { productsEndpoint } from "../apis/endpoints";

class ProductService extends BaseService {

    constructor() {
        super(productsEndpoint);
    }
}

export default new ProductService();