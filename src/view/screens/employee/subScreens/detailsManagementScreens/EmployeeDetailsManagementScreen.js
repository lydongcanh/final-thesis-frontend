import React, { useState } from "react";
import { Layout, Input, Datepicker } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import { EmployeeJobTitleSelector } from "../../../../components/employees";
import { GenderSelector, AddressInputPanel } from "../../../../components/others";
import { EmployeeService, AccountService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function EmployeeDetailsManagementScreen({ route }) {

    const employees = route ? route.params.employees : null;

    const [name, setName] = useState("Lý Đông Cảnh");
    const [addressNumber, setAddressNumber] = useState("12/ABC");
    const [addressStreet, setAddressStreet] = useState("Quang Trung");
    const [addressDistrict, setAddressDistrict] = useState("Gò Vấp");
    const [addressCity, setAddressCity] = useState("TP.HCM");
    const [phoneNumber, setPhoneNumber] = useState("0123456789");
    const [email, setEmail] = useState("abcdefgh@gmail.com");
    const [password, setPassword] = useState("abcd1234");
    const [imagePath, setImagePath] = useState("https://placeimg.com/480/480/animal");
    const [gender, setGender] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [birthdate, setbirthdate] = useState(new Date(1998, 12, 31));

    async function createEmployee() {
        const accountResult = await AccountService.employeeSignup(email, password);
        if (accountResult.error)
            return accountResult;

        const result = await EmployeeService.create({
            name: name, 
            birthdate: birthdate, 
            address: { 
                number: addressNumber, 
                street: addressStreet, 
                district : addressDistrict, 
                city: addressCity 
            },
            phoneNumber, email, 
            email: email,
            gender: gender,
            imagePath: imagePath,
            jobTitle: jobTitle,
            accountId: accountResult.data.id
        });
        return result;
    }

    async function updateEmployee() {
        return { error: "Dang cap nhat" }
    }

    function canAdd() {
        return name && name !== "" &&
            addressNumber && addressNumber !== "" &&
            addressStreet && addressStreet !== "" &&
            addressDistrict && addressDistrict !== "" &&
            addressCity && addressCity !== "" &&
            hasValidPhoneNumber() &&
            hasValidEmail() &&
            email && email !== "" &&
            password && setPassword !== "" &&
            imagePath && imagePath !== "" &&
            gender && gender !== "" &&
            jobTitle && jobTitle !== "";
    }

    function hasValidPhoneNumber() {
        if (!phoneNumber || phoneNumber === "")
            return false;

        if (!employees || employees.length < 1)
            return true;

        return !checkExistPhoneNumber();
    }

    function hasValidEmail() {
        if (!email || email === "")
            return false;

        if (!employees || employees.length < 1)
            return true;

        return !checkExistEmail();
    }

    function checkExistPhoneNumber() {
        for(const pn of employees.map(e => e.phoneNumber)) {
            if (phoneNumber === pn)
                return true;
        }   
        return false;
    }

    function checkExistEmail() {
        for(const e of employees.map(e => e.email)) {
            if (email === e)
                return true;
        }   
        return false;
    }
    
    function resetInputValues() {
        setName("")
        setAddressNumber("");
        setAddressStreet("");
        setAddressDistrict("");
        setAddressCity("");
        setPhoneNumber("");
        setEmail("");
        setImagePath("");
        setGender("");
        setJobTitle("");
    }

    function getInputUI(label, value, onChangeText, maxLength, keyboardType = "default") {
        return (
            <Input
                label={label}
                value={value}
                onChangeText={onChangeText}
                maxLength={maxLength}
                keyboardType={keyboardType}
                style={styles.input}
            />
        );
    }

    function getContentUI() {
        return (
            <Layout>
                {getInputUI("Tên", name, setName, 100)}
                {getInputUI("Số điện thoại", phoneNumber, setPhoneNumber, 10, "phone-pad")}
                {getInputUI("Email", email, setEmail, 50, "email-address")}
                <Input
                    label="Mật khẩu (mặc định)"
                    disabled
                    value={password}
                    onChangeText={setPassword}
                    maxLength={50}
                    style={styles.input}
                />
                {getInputUI("Ảnh", imagePath, setImagePath, 200, "url")}
                <EmployeeJobTitleSelector
                    jobTitle={jobTitle}
                    setJobTitle={setJobTitle}
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
                    style={styles.input}
                />
                <Layout style={{ padding: 8 }}>
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
                </Layout>
            </Layout>
        );
    }
    return (
        <DetailsManagementTemplateScreen 
            route={route}
            createFunction={createEmployee}
            updateFunction={updateEmployee}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}