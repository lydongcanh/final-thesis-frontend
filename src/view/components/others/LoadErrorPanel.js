import React from "react";
import { Button, Icon, Layout, Text } from "@ui-kitten/components";
import { Space } from ".";
import { Texts } from "../../../core/texts";

/**
 * 
 * @param {*} param0 message, onReload
 */
export default function LoadErrorPanel({ message, onReload }) {

    const displayMessage = !message ? Texts.LOAD_ERROR_DETAUL_MESSAGE : message;

    return (
        <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text appearance="hint">{displayMessage}</Text>
            <Space />
            <Button
                size="tiny"
                icon={(style) => <Icon {...style} name="sync" />}
                onPress={onReload}
            >
                Thử lại
            </Button>
        </Layout>
    );
}