import React from "react";
import { Text, Layout } from "@ui-kitten/components";
import { formatDate } from "../../../../core/utilities";

export default function EmployeeAccountDetailsScreen({ route }) {
    const employee = route ? route.params.employee : null;

    return (
        <Layout style={{ flex: 1, padding: 16 }}>
            <Text>Tên: {employee.name}</Text>
            <Text>Ngày sinh: {formatDate(employee.birthdate)}</Text>
            <Text>Số nhà: {employee.address.number}</Text>
            <Text>Đường: {employee.address.street}</Text>
            <Text>Quận: {employee.address.district}</Text>
            <Text>Thành phố: {employee.address.city}</Text>
            <Text>Số điện thoại: {employee.phoneNumber}</Text>
            <Text>Email: {employee.email}</Text>
            <Text>Chức vụ: {employee.jobTitle}</Text>
        </Layout>
    );
}