import BaseService from "./baseService";
import { productDetailsEndpoint } from "../apis/endpoints";

class ProductDetailsService extends BaseService {

    constructor() {
        super(productDetailsEndpoint);
    }
}

export default new ProductDetailsService();