import React, { useState } from "react";
import { Layout, Input, Datepicker, Button } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import { EmployeeJobTitleSelector } from "../../../../components/employees";
import { GenderSelector, AddressInputPanel } from "../../../../components/others";
import { EmployeeService, AccountService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function EmployeeDetailsManagementScreen({ navigation, route }) {

    const employees = route ? route.params.employees : null;
    const employee = route ? route.params.employee : null;

    const [name, setName] = useState(employee ? employee.name : null);
    const [addressNumber, setAddressNumber] = useState(employee ? employee.address.number : null);
    const [addressStreet, setAddressStreet] = useState(employee ? employee.address.street : null);
    const [addressDistrict, setAddressDistrict] = useState(employee ? employee.address.district : null);
    const [addressCity, setAddressCity] = useState(employee ? employee.address.city : null);
    const [phoneNumber, setPhoneNumber] = useState(employee ? employee.phoneNumber : null);
    const [email, setEmail] = useState(employee ? employee.email : null);
    const [password, setPassword] = useState("abcd1234");
    const [imagePath, setImagePath] = useState(employee ? employee.imagePath : null);
    const [gender, setGender] = useState(employee ? employee.gender : null);
    const [jobTitle, setJobTitle] = useState(employee ? employee.jobTitle : null);
    const [birthdate, setbirthdate] = useState(employee ? new Date(Date.parse(employee.birthdate)) : new Date(1, 1, 1990));

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
        const newE = {
            id: employee.id,
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
            accountId: employee.accountId
        };
        console.log(newE);
        const result = await EmployeeService.update(newE);
        return result;
    }

    function canAdd() {
        if (employee)
            return true;

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
        if (employee)
            return true;

        if (!email || email === "")
            return false;

        if (!employees || employees.length < 1)
            return true;

        return !checkExistEmail();
    }

    function checkExistPhoneNumber() {
        if (employee)
            return true;
        
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

    function getInputUI(label, value, onChangeText, maxLength, keyboardType = "default", disabled = false) {
        return (
            <Input
                disabled={disabled}
                label={label}
                value={value}
                onChangeText={onChangeText}
                maxLength={maxLength}
                keyboardType={keyboardType}
                style={styles.input}
            />
        );
    }

    function getPasswordUI() {
        if (employee)
            return;

        return (
            <Input
                label="Mật khẩu (mặc định)"
                disabled
                value={password}
                onChangeText={setPassword}
                maxLength={50}
                style={styles.input}
            />
        );
    }
    function getContentUI() {
        return (
            <Layout>
                {getInputUI("Tên", name, setName, 100)}
                {getInputUI("Số điện thoại", phoneNumber, setPhoneNumber, 10, "phone-pad")}
                {getInputUI("Email", email, setEmail, 50, "email-address", (employee != null))}
                {getPasswordUI()}
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
            navigation={navigation}
            route={route}
            createFunction={createEmployee}
            updateFunction={updateEmployee}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}