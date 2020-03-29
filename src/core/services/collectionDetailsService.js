import BaseService from "./baseService";
import { productCollectionDetailsEndpoint } from "../apis/endpoints";

class CollectionDetailsService extends BaseService {

    constructor() {
        super(productCollectionDetailsEndpoint);
    }

    /**
     * @param {string} collectionId Collection's id.
     */
    async getDetailsOfCollection(collectionId) {
        return await this.query({
            productCollectionId: collectionId
        });
    }
}

export default new CollectionDetailsService();