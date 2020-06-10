import React, { useState } from "react";
import { Layout, Input, Datepicker, Button } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import { EmployeeJobTitleSelector } from "../../../../components/employees";
import { GenderSelector, AddressInputPanel } from "../../../../components/others";
import { EmployeeService, AccountService } from "../../../../../core/services";
import { validateUsername, validatePhoneNumber } from "../../../../../core/validations";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function EmployeeDetailsManagementScreen({ navigation, route }) {

    const employees = route ? route.params.employees : [];
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

    const [phoneNumberMessage, setPhoneNumberMessage] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    async function createEmployee() {
        if (!validateInputs())
            return { error: true };

        const accountResult = await AccountService.employeeSignup(email, password);
        if (accountResult.error)
            return accountResult;

        const account = accountResult.data;
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
            accountId: account.id
        });

        account.employeeId = result.data.id;
        await AccountService.update(account);

        return result;
    }

    async function updateEmployee() {
        if (!validateInputs())
            return { error: true };

        const newEmployee = {
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
        
        const result = await EmployeeService.update(newEmployee);
        return result;
    }

    function validateInputs() {
        let validFlag = true;
        for(const e of employees) {
            if (e.email == email && (!employee || employee.email != e.email)) {
                setEmailMessage("Email đã tồn tại.");
                validFlag = false;
            }

            if (e.phoneNumber == phoneNumber && (!employee || employee.phoneNumber != e.phoneNumber)) {
                setPhoneNumberMessage("Số điện thoại đã tồn tại.");
                validFlag = false;
            }
        }
        return validFlag;
    }

    function canAdd() {
        if (employee)
            return true;

        return name && name !== "" &&
            addressNumber && addressNumber !== "" &&
            addressStreet && addressStreet !== "" &&
            addressDistrict && addressDistrict !== "" &&
            addressCity && addressCity !== "" &&
            phoneNumber && phoneNumber !== "" && validatePhoneNumber(phoneNumber) &&
            email && email !== "" && validateUsername(email) &&
            password && setPassword !== "" &&
            imagePath && imagePath !== "" &&
            gender && gender !== "" &&
            jobTitle && jobTitle !== "";
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

    function getInputUI(label, value, onChangeText, maxLength,
        keyboardType = "default", disabled = false, caption = "") {
        return (
            <Input
                caption={caption}
                status={(caption && caption != "") ? "danger" : "basic"}
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
                {getInputUI("Email", email, setEmail, 50, "email-address", (employee != null), emailMessage)}
                {getPasswordUI()}
                {getInputUI("Tên", name, setName, 100)}
                {getInputUI("Số điện thoại", phoneNumber, setPhoneNumber, 10, "phone-pad", false, phoneNumberMessage)}
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