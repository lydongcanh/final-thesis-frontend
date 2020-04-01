import BaseService from "./baseService";
import { customerCartEndpoint } from "../apis/endpoints";

class CustomerCartService extends BaseService {

    constructor() {
        super(customerCartEndpoint);
    }

    /**
     * @param {string} customerId 
     */
    async getCartItemsByCustomerId(customerId) {
        return await super.query({
            customerId: customerId
        });
    }

    async inscreaseQuantity(cartItem) {
        if(cartItem.quantity >= cartItem.productDetails.unitsInStock)
            return false;

        cartItem.quantity++;
        return await super.update(cartItem);
    }

    async decreaseQuantity(cartItem) {
        if (cartItem.quantity <= 0)
            return false;

        cartItem.quantity--;
        return await super.update(cartItem);
    }
}

export default new CustomerCartService();