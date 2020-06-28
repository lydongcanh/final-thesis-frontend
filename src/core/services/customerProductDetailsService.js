import BaseService from "./baseService";
import { customerProductDetailsEndpoint } from "../apis/endpoints";

class CustomerProductDetailsService extends BaseService {

    constructor() {
        super(customerProductDetailsEndpoint);
    }

    /**
     * @param {string} customerId 
     * @param {string} productId 
     */
    async toggleCustomerLikedProduct(customerId, productId, hasOldState, newState) {
        if (hasOldState) {
            return await super.update({
                customerId: customerId,
                productId: productId,
                liked: newState
            })
        }

        return await super.create({
            customerId: customerId,
            productId: productId,
            liked: true
        });
    }

    /**
     * @param {string} customerId 
     * @param {string} productId 
     */
    async getByProductAndCustomerId(customerId, productId) {
        return await super.query({
            customerId: customerId,
            productId: productId
        });
    }

    /**
     * @param {string} customerId 
     */
    async getByCustomerId(customerId) {
        return await super.query({
            customerId: customerId
        });
    }

    /**
     * @param {string} customerId 
     */
    async getFavouriteProductByCustomerId(customerId) {
        return await super.query({
            customerId: customerId,
            liked: true
        });
    }
}

export default new CustomerProductDetailsService();