import BaseService from "./baseService";
import { productsEndpoint } from "../apis/endpoints";

class ProductService extends BaseService {

    constructor() {
        super(productsEndpoint);
    }

    async getByCategoryId(categoryId) {
        return await this.query({
            categoryId: categoryId
        });
    }
}

export default new ProductService();