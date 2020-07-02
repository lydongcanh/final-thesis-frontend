import { AccountService } from ".";
import { emailsEndpoint } from "../apis/endpoints";
import BaseAPI from "../apis/baseAPI";
import { formatDateTime } from "../utilities";

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