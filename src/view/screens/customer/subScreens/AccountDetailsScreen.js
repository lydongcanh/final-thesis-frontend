import React, { useState } from "react";
import { Datepicker, Card, CardHeader, Layout, Input, Button } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { Toast } from "native-base";
import { AddressInputPanel, Space, GenderSelector } from "../../../components/others";
import { validatePhoneNumber } from "../../../../core/validations";
import { CustomerService } from "../../../../core/services";
import { Texts } from "../../../../core/texts";

export default function AccountDetailsScreen({ route }) {

    const { customer } = route.params;
    const { address } = customer;

    const [addressNumber, setAddressNumber] = useState(address !== null ? address.number : "");
    const [addressStreet, setAddressStreet] = useState(address !== null ? address.street : "");
    const [addressDistrict, setAddressDistrict] = useState(address !== null ? address.district : "");
    const [addressCity, setAddressCity] = useState(address !== null ? address.city : "");
    const [name, setName] = useState(customer !== null ? customer.name : "");
    const [phoneNumber, setPhoneNumber] = useState(customer !== null ? customer.phoneNumber : "");
    const [imagePath, setImagePath] = useState(customer !== null ? customer.imagePath : "");
    const [gender, setGender] = useState(customer !== null ? customer.gender : "");
    const [birthdate, setBirthdate] = useState(customer !== null ? new Date(Date.parse(customer.birthdate)) : new Date());
    const [edited, setEdited] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // TODO: sync data in saved customer data...
    async function handleSaveButton() {
        if(!customer || !shouldSaveInfo())
            return;

        try {
            setIsSaving(true);
            const result = await CustomerService.update({
                id: customer.id,
                name: name,
                birthdate: birthdate,
                address: {
                    number: addressNumber,
                    street: addressStreet,
                    district: addressDistrict,
                    city: addressCity
                },
                phoneNumber: phoneNumber,
                imagePath: imagePath,
                gender: gender
            });

            if (result.error) {
                Toast.show({
                    text: Texts.SAVE_ACCOUNT_ERROR,
                    type: "danger",
                    duration: 3000
                });
            } else {
                Toast.show({
                    text: Texts.SAVE_ACCOUNT_SUCCESS,
                    type: "success",
                    duration: 3000
                });
                setEdited(false);
            }
        } catch(e) {
            console.log(e);
        } finally {
            setIsSaving(false);
        }
    }

    function shouldSaveInfo() {
        return edited &&
               addressNumber !== null && addressNumber !== "" &&
               addressStreet !== null && addressStreet !== "" &&
               addressDistrict !== null && addressDistrict !== "" &&
               addressCity !== null && addressCity !== "" &&
               hasValidOtherInfo();
    }

    function hasValidOtherInfo() {
        return name !== null && name !== "" &&
               imagePath !== null && imagePath !== "" &&
               phoneNumber !== null && validatePhoneNumber(phoneNumber) &&
               gender !== null && gender !== "";
    }

    function getInputUI(label, value, onChangeText, maxLength) {
        return (
            <Input
                label={label}
                value={value}
                onChangeText={text => {
                    setEdited(true);
                    onChangeText(text);
                }}
                maxLength={maxLength}
                style={{ marginBottom: 8 }}
            />
        );
    }

    if (isSaving) {
        return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />
    } else {
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
                            disabled
                            status={hasValidOtherInfo() ? "success" : "danger"}
                            header={() => <CardHeader title="Thông tin khác" />}
                        >
                            {getInputUI("Họ tên", name, setName, 100)}
                            {getInputUI("Số điện thoại", phoneNumber, setPhoneNumber, 10)}
                            {getInputUI("Ảnh đại diện", imagePath, setImagePath, 500)}
                            <GenderSelector 
                                gender={gender} 
                                setGender={gender => {
                                    setEdited(true);
                                    setGender(gender);
                                }}
                            />
                            <Datepicker
                                label="Ngày sinh"
                                min={new Date(1900, 12, 31)}
                                max={new Date()}
                                date={birthdate}
                                style={{ marginBottom: 8 }}
                                onSelect={date => {
                                    setEdited(true);
                                    setBirthdate(date);
                                }}
                            />
                        </Card>
                    </Layout>
                </ScrollView>

                <Button
                    disabled={!shouldSaveInfo()}
                    style={{ borderRadius: 24, margin: 12 }}
                    onPress={handleSaveButton}
                >
                    Lưu
                </Button>
            </Layout>
        );
    }
}