import React, { useState } from "react";
import { Avatar, Button, ActivityIndicator } from "react-native-paper";
import { Card, CardHeader, Input, Text, Datepicker, Layout } from "@ui-kitten/components"
import { Toast } from "native-base";
import { GenderSelector } from "../others";
import { EmployeeJobTitleSelector } from ".";
import { EmployeeService, AccountService } from "../../../core/services";

/**
 * @param {*} props onOk, onCancel
 */
export default function EmployeeManageForm(props) {

    const [name, setName] = useState("Ly Dong Canh");
    const [address, setAddress] = useState("12/ABC EHTF HASDA");
    const [phoneNumber, setPhoneNumber] = useState("0123456789");
    const [email, setEmail] = useState("@gmail.com");
    const [imagePath, setImagePath] = useState("https://placeimg.com/480/480/animal");
    const [gender, setGender] = useState("Nam");
    const [jobTitle, setjobTitle] = useState("Quản lý");
    const [birthdate, setbirthdate] = useState(new Date(1998, 12, 31));
    const [isLoading, setIsLoading] = useState(false);

    async function handleOnOk() {
        setIsLoading(true);

        const accountResult = await AccountService.customerSignup(email, "abcd1234");
        console.log(accountResult);

        if (accountResult.error) {
            Toast.show({ 
                text: accountResult.error, 
                type: "danger",
                onClose: () => setIsLoading(false)
            });
            return;
        }
        
        const result = await EmployeeService.create({
            name: name, 
            birthdate: birthdate, 
            address: address, 
            phoneNumber, email, 
            email: email,
            gender: gender,
            imagePath: imagePath,
            jobTitle: jobTitle,
            accountId: accountResult.data.id
        });

        console.log(result);
        setIsLoading(false);

        //props.onOk();
    }

    function handleOnCancel() {
        props.onCancel();
    }


    function getFooter() {
        return (
            <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button onPress={handleOnCancel} disabled={false}>Cancel</Button>
                <Button onPress={handleOnOk} disabled={isLoading}>Ok</Button>
            </Layout>
        );
    }

    function getHeader() {
        return (
            <CardHeader title="Thêm nhân viên" />
        );
    }

    function getCardContent() {
        if (isLoading)
            return <ActivityIndicator />

        return (
            <Layout>
                <Input
                    label="Tên"
                    value={name}
                    onChangeText={setName}
                    maxLength={100}
                />
                <Input
                    label="Địa chỉ"
                    value={address}
                    onChangeText={setAddress}
                    maxLength={100}
                />
                <Input
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    maxLength={50}
                />
                <Input
                    label="Ảnh"
                    value={imagePath}
                    onChangeText={setImagePath}
                    keyboardType="url"
                />
                <EmployeeJobTitleSelector
                    jobTitle={jobTitle}
                    setJobTitle={setjobTitle}
                />
                <GenderSelector
                    gender={gender}
                    setGender={setGender}
                />
                <Datepicker
                    label="Ngày sinh"
                    min={new Date(1900, 12, 31)}
                    max={new Date()}
                    date={birthdate}
                    onSelect={setbirthdate}
                />
            </Layout>
        );
    }

    return (
        <Card
            footer={getFooter}
            header={getHeader}
        >
            {getCardContent()}
        </Card>
    )
}