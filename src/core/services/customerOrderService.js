import BaseService from "./baseService";
import { customerOrdersEndpoint } from "../apis/endpoints";
import { CustomerOrderDetailsService, CustomerCartService } from ".";
import { CUSTOMER_ORDER_TYPES } from "../types";

class CustomerOrderService extends BaseService {

    constructor() {
        super(customerOrdersEndpoint);
    }

    /**
     * Create new order with customer & cart items data.
     * Return error or added order if success.
     */
    async createNewCustomerOrder(customer, cartItems, number, street, district, city) {
        try {
            const address = { number, street, district, city };
            
            const orderResult = await this.create({
                orderState: CUSTOMER_ORDER_TYPES.Pending,
                shipAddress: address,
                customerId: customer.id
            });
            
            if (orderResult.error)
                return orderResult.error;

            const order = orderResult.data;
            for(let item of cartItems) {
                try {
                    const data = {
                        quantity: item.quantity,
                        purchasedPrice: item.productDetails.product.unitPrice,
                        productDetailsId: item.productDetails.id,
                        customerOrderId: order.id
                    }
                    await CustomerOrderDetailsService.create(data);
                    CustomerCartService.delete(item.id);
                } catch (e) {
                    return { error: e }
                }
            }
            return { data: order };
        } catch(e) {
            return { error: e };
        }
    }
}

export default new CustomerOrderService();