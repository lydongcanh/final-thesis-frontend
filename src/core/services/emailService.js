import { AccountService, CustomerProductDetailsService } from ".";
import { emailsEndpoint } from "../apis/endpoints";
import BaseAPI from "../apis/baseAPI";
import { formatDateTime, formatCurrency } from "../utilities";
import { ACCOUNT_TYPES } from "../types";

class EmailService {

    constructor() {
        this.restClient = new BaseAPI(emailsEndpoint);
    }

    async sendEmail (to, subject, body) {
        await this.restClient.post({
            to: to,
            subject: subject,
            body: body
        });
    }

    async sendEmailToActiveEmployees(subject, body) {
        const result = await AccountService.getActiveEmployeeAccounts();
        for(const account of result.data)
            this.sendEmail(account.username, subject, body);
    }

    async sendNewOrderEmail(order, address, customer, cartItems) {
        let body = `Id: ${order.id}.\n`;
        body += `Thời gian tạo: ${formatDateTime(order.creationDate)}.\n`;
        body += `Khách hàng: ${customer.name}.\n`;
        body += `Số điện thoại: ${customer.phoneNumber}.\n`;
        body += `Email: ${customer.email}.\n`;
        body += `Địa chỉ: ${address.number}, ${address.street}, ${address.district}, ${address.city}.\n`;
        body += "\nSản phẩm:\n";
        
        for(const item of cartItems)
            body += `- ${item.productDetails.product.name}, màu: ${item.productDetails.color}, size: ${item.productDetails.size}, số lượng: ${item.quantity}.\n`;

        await this.sendEmailToActiveEmployees("Đơn hàng mới", body);
    }

    async sendNewDiscountEmail(product) {
        try {
            let body = `Sản phẩm: ${product.name}\n`;
            body += `- Giá gốc: ${formatCurrency(product.unitPrice)}VNĐ\n`;
            body += `- Giảm giá còn: ${formatCurrency(product.unitPrice - product.discountAmount)}VNĐ\n`;
            body += `\nMua ngay hôm nay để tiết kiệm đến ${formatCurrency(product.discountAmount)}VNĐ ngay hôm nay, số lượng có hạn.`;

            const cResult = await CustomerProductDetailsService.query({ 
                productId: product.id,
                liked: true
            });

            if (!cResult || !cResult.data || cResult.data.length < 1)
                return;

            for(const cpd of cResult.data) {
                const aResult = await AccountService.query({ 
                    type: ACCOUNT_TYPES.Customer,
                    customerId: cpd.customerId
                });

                if (aResult && aResult.data && aResult.data.length > 0)
                    await this.sendEmail(aResult.data[0].username, "Sản phẩm khuyến mãi mới", body);
            }
        } catch(e) {
            console.log(e);
        }
    }

    async sendCustomerOrderStateChange(order, newState) {
        const account = await AccountService.getByCustomerId(order.customerId);

        let body = `Id: ${order.id}.\n`;
        body += `Đơn hàng đã được chuyển sang trạng thái: ${newState.orderState}.\n`;
        if (newState.description && newState.description != "")
            body += `Ghi chú: ${newState.description}\n`;

        await this.sendEmail(account.data[0].username, "Cập nhật đơn hàng", body);    
    }
}

export default new EmailService();