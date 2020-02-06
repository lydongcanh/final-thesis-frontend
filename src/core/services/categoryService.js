import { categoriesEndpoint } from "../apis/endpoints";
import BaseService from "./baseService";

class CategoryService extends BaseService {
    
    constructor() {
        super(categoriesEndpoint);
    }

    async getAllLeaf() {
        return await this.query({
            isLeaf: true,
        });
    }

    async getAllRoot() {
        return await this.query({
            isRoot: true
        });
    }
}

export default new CategoryService();