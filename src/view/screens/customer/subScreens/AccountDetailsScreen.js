import React, { useState } from "react";
import { Datepicker, Card, CardHeader, Layout, Text, Input, Button } from "@ui-kitten/components";
import { AddressInputPanel, Space, GenderSelector } from "../../../components/others";
import { ScrollView } from "react-native-gesture-handler";

export default function AccountDetailsScreen({ route }) {

    const { customer } = route.params;
    const { address } = customer;

    const [addressNumber, setAddressNumber] = useState(address !== null ? address.number : "");
    const [addressStreet, setAddressStreet] = useState(address !== null ? address.street : "");
    const [addressDistrict, setAddressDistrict] = useState(address !== null ? address.district : "");
    const [addressCity, setAddressCity] = useState(address !== null ? address.city : "");
    const [phoneNumber, setPhoneNumber] = useState(customer !== null ? customer.phoneNumber : "");
    const [imagePath, setImagePath] = useState(customer !== null ? customer.imagePath : "");
    const [gender, setGender] = useState(customer !== null ? customer.gender : "");
    const [birthdate, setBirthdate] = useState(customer !== null ? new Date(Date.parse(customer.birthdate)) : new Date());
    const [edited, setEdited] = useState(false);

    function getInputUI(label, value, onChangeText, maxLength) {
        return (
            <Input
                label={label}
                value={value}
                onChangeText={onChangeText}
                maxLength={maxLength}
            />
        );
    }

    return (
        <Layout style={{ flex: 1, justifyContent: "space-between" }}>
            <ScrollView>
                <Layout style={{ flex: 1, padding: 16 }}>
                    <AddressInputPanel
                        title="Địa chỉ"
                        addressNumber={addressNumber}
                        addressStreet={addressStreet}
                        addressDistrict={addressDistrict}
                        addressCity={addressCity}
                        setAddressNumber={setAddressNumber}
                        setAddressStreet={setAddressStreet}
                        setAddressDistrict={setAddressDistrict}
                        setAddressCity={setAddressCity}
                    />
                    <Space />

                    <Card
                        status="success"
                        header={() => <CardHeader title="Thông tin khác" />}
                    >
                        {getInputUI("Số điện thoại", phoneNumber, setPhoneNumber, 10)}
                        {getInputUI("Ảnh đại diện", imagePath, setImagePath, 500)}
                        <GenderSelector gender={gender} setGender={setGender} />
                        <Datepicker
                            label="Ngày sinh"
                            min={new Date(1900, 12, 31)}
                            max={new Date()}
                            date={birthdate}
                            onSelect={setBirthdate}
                        />
                    </Card>
                </Layout>
            </ScrollView>

            <Button
                disabled={!edited}
                style={{ borderRadius: 24, margin: 12 }}
            >
                Lưu
            </Button>
        </Layout>
    );
}