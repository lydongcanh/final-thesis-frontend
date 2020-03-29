import BaseService from "./baseService";
import { productCollectionEndpoint } from "../apis/endpoints";

class CollectionService extends BaseService {

    constructor() {
        super(productCollectionEndpoint);
    }

    async getMainPageCollection() {
        return await this.query({
            showOnMainPage: true
        });
    }
}

export default new CollectionService();