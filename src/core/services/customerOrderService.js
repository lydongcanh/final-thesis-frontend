import BaseService from "./baseService";
import { customerOrdersEndpoint } from "../apis/endpoints";
import { CustomerOrderDetailsService, CustomerCartService } from ".";
import { CUSTOMER_ORDER_TYPES } from "../types";

class CustomerOrderService extends BaseService {

    constructor() {
        super(customerOrdersEndpoint);
    }

    /**
     * @param {string} customerId 
     */
    async getByCustomerId(customerId) {
        return super.query({
            customerId: customerId
        })
    }

    calculateFinalPrice(order) {
        let price = 0;
        for(const detail of order.orderDetails)
            price += detail.quantity * detail.purchasedPrice;
        return price;
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
            const details = [];
            for(let item of cartItems) {
                try {
                    const data = {
                        quantity: item.quantity,
                        purchasedPrice: item.productDetails.product.unitPrice,
                        productDetailsId: item.productDetails.id,
                        customerOrderId: order.id
                    }
                    const detail = await CustomerOrderDetailsService.create(data);
                    details.push(detail.data);
                    CustomerCartService.delete(item.id);
                } catch (e) {
                    return { error: e }
                }
            }
            order.orderDetails = details;
            return { data: order };
        } catch(e) {
            return { error: e };
        }
    }
}

export default new CustomerOrderService();