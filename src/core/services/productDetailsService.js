import BaseService from "./baseService";
import { productDetailsEndpoint } from "../apis/endpoints";

class ProductDetailsService extends BaseService {

    constructor() {
        super(productDetailsEndpoint);
    }

    /**
     * @param {string} productId 
     */
    async getDetaisByProductId(productId) {
        return await super.query({
            productId: productId
        });
    }
}

export default new ProductDetailsService();