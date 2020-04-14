import React, { useState } from "react";
import { Layout, Input, Button, Card, CardHeader } from "@ui-kitten/components";
import { styles } from "../../../../styles";

export default function AddCollectionScreen() {

    const [name, setName] = useState();
    const [isLoading, setIsLoading] = useState(false);

    async function handleConfirmButton() {
        alert(JSON.stringify({
            name, unitPrice, mainImage, subImages
        }, null, 2))
    }

    function canAdd() {
        return name && name !== "" &&
            !isLoading;
    }

    function getProductsUI() {
        return (
            <Card
                style={{ margin: 8 }}
                disabled
                header={style => <CardHeader {...style} title="Sản phẩm (đang cập nhật)" />}
            >

            </Card>
        )
    }

    return (
        <Layout style={{ flex: 1, padding: 16, justifyContent: "space-between" }}>
            <Layout>
                <Input
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    label="Tên bộ sưu tập"
                />
                {getProductsUI()}
            </Layout>
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