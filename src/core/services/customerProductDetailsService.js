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
    toggleCustomerLikedProduct(customerId, productId, hasOldState, newState) {
        if (hasOldState) {
            super.update({
                customerId: customerId,
                productId: productId,
                liked: newState
            })
        } else {
            super.create({
                customerId: customerId,
                productId: productId,
                liked: true
            });
        }
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
}

export default new CustomerProductDetailsService();