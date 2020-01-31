import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardHeader, Layout, Icon, Input } from "@ui-kitten/components";
import { validateUsername, validatePassword } from "../../../core/validations";
import { Texts } from "../../../core/texts";
import { login } from "../../redux/actions/authActions";

export default function LoginPanel() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [isHidingPassword, setIsHidingPassword] = useState(true);

    const dispatch = useDispatch();

    const showPasswordIcon = style => (
        <Icon {...style} name={isHidingPassword ? "eye-off" : "eye"} />
    );

    const cardFooter = () => (
        <Layout style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <Button
                disabled={!validUsername || !validPassword}
                onPress={handleLoginButtonPress}
                size="small"
            >
                Login
            </Button>
        </Layout>
    );

    function handleUsernameInputChange(username) {
        setUsername(username);
        setEditingUsername(true);
        setValidUsername(validateUsername(username));
    }

    function handlePasswordInputChange(password) {
        setPassword(password);
        setEditingPassword(true);
        setValidPassword(validatePassword(password));
    }

    function handleLoginButtonPress() {
        dispatch(login(username, password));
    }

    return (
        <Card
            appearance="filled"
            header={() => <CardHeader title="Login" />}
            footer={cardFooter}
        >
            <Input
                caption={editingUsername ? validUsername ? "" : Texts.INVALID_USERNAME : ""}
                label="username"
                maxLength={50}
                onChangeText={handleUsernameInputChange}
                status={editingUsername ? validUsername ? "success" : "danger" : "basic"}
                value={username}
            />
            <Input
                caption={editingPassword ? validPassword ? "" : Texts.INVALID_PASSWORD : ""}
                icon={showPasswordIcon}
                label="password"
                maxLength={50}
                onChangeText={handlePasswordInputChange}
                onIconPress={() => setIsHidingPassword(!isHidingPassword)}
                secureTextEntry={isHidingPassword}
                status={editingPassword ? validPassword ? "success" : "danger" : "basic"}
                value={password}
            />
        </Card>
    );
}