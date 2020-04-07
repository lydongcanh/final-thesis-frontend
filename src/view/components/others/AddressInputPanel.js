import React from "react";
import { Card, CardHeader, Layout, Input } from "@ui-kitten/components";

/**
 * @param {*} props 
 * title,
 * addressNumber, setAddressNumber, 
 * addressStreet, setAddressStreet, 
 * addressDistrict, setAddressDistrict, 
 * addressCity, setAddressCity
 */
export default function AddressInputPanel(props) {
    
    const {title, addressNumber, setAddressNumber, addressStreet, setAddressStreet, 
           addressDistrict, setAddressDistrict, addressCity, setAddressCity } = props;

    function getAddressInputUI(title, value, onChangeText) {
        return (
            <Layout>
                <Input
                    label={title}
                    value={value}
                    onChangeText={onChangeText}
                    maxLength={50}
                    style={{ marginBottom: 8 }}
                />
            </Layout>
        );
    }

    /** Validate all infomations */
    function isPurchasable() {
        return addressNumber && addressNumber.length > 0 &&
            addressStreet && addressStreet.length > 0 &&
            addressDistrict && addressDistrict.length > 0 &&
            addressCity && addressCity.length > 0;
    }

    return (
        <Card
            disabled
            status={isPurchasable() ? "success" : "danger"}
            header={() => <CardHeader title={title} />}
        >
            {getAddressInputUI("Số nhà", addressNumber, setAddressNumber)}
            {getAddressInputUI("Tên đường", addressStreet, setAddressStreet)}
            {getAddressInputUI("Quận", addressDistrict, setAddressDistrict)}
            {getAddressInputUI("Thành phố", addressCity, setAddressCity)}
        </Card>
    );
}