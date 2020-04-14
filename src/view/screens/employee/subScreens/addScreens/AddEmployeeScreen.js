import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Layout, Input, Button, Card, CardHeader, Datepicker } from "@ui-kitten/components";
import { styles } from "../../../../styles";
import { EmployeeJobTitleSelector } from "../../../../components/employees";
import { GenderSelector, AddressInputPanel } from "../../../../components/others";

export default function AddEmployeeScreen() {

    const [name, setName] = useState("Lý Đông Cảnh");
    const [addressNumber, setAddressNumber] = useState("12/ABC");
    const [addressStreet, setAddressStreet] = useState("Quang Trung");
    const [addressDistrict, setAddressDistrict] = useState("Gò Vấp");
    const [addressCity, setAddressCity] = useState("TP.HCM");
    const [phoneNumber, setPhoneNumber] = useState("0123456789");
    const [email, setEmail] = useState("abcdefgh@gmail.com");
    const [password, setPassword] = useState("0123456789");
    const [imagePath, setImagePath] = useState("https://placeimg.com/480/480/animal");
    const [gender, setGender] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [birthdate, setbirthdate] = useState(new Date(1998, 12, 31));
    const [isLoading, setIsLoading] = useState(false);

    async function handleConfirmButton() {
        alert(JSON.stringify({
            name, address: { addressNumber, addressCity, addressDistrict, addressCity }, 
            phoneNumber, email, password, imagePath, gender, jobTitle, birthdate
        }, null, 2))
    }

    function canAdd() {
        return name && name !== "" &&
               addressNumber && addressNumber !== "" &&
               addressStreet && addressStreet !== "" &&
               addressDistrict && addressDistrict !== "" &&
               addressCity && addressCity !== "" &&
               phoneNumber && phoneNumber !== "" &&
               email && email !== "" &&
               password && setPassword !== "" &&
               imagePath && imagePath !== "" &&
               gender && gender !== "" &&
               jobTitle && jobTitle !== "" &&
               !isLoading;
    }

    return (
        <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
           <ScrollView style={{ flex: 1 }}>
                <Input
                    label="Tên"
                    value={name}
                    onChangeText={setName}
                    maxLength={100}
                    style={styles.input}
                />
                <Input
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={styles.input}
                />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    maxLength={50}
                    style={styles.input}
                />
                <Input
                    label="Mật khẩu (mặc định)"
                    disabled
                    value={password}
                    onChangeText={setPassword}
                    maxLength={50}
                    style={styles.input}
                />
                <Input
                    label="Ảnh"
                    value={imagePath}
                    onChangeText={setImagePath}
                    keyboardType="url"
                    style={styles.input}
                />
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
            </ScrollView>
            <Button
                style={{ borderRadius: 25 }}
                disabled={!canAdd()}
                onPress={handleConfirmButton}
            >
                Xác nhận
            </Button>
        </Layout>
    );
}