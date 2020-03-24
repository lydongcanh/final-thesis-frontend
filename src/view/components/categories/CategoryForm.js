import React, { useState } from "react";
import { Button, Card, CardHeader, Input, Text } from "@ui-kitten/components";
import { CategoryService } from "../../../core/services";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

/**
 * 
 * @param {*} props mode["create", "edit", "delete"], category, onCancel, onOk
 */
export default function CategoryForm(props) {

    const { mode, category } = props;

    const [name, setName] = useState(mode == "edit" && category != null ? category.name : "");
    const [description, setDescription] = useState(mode == "edit" && category != null ? category.description : "");
    const [isProgressing, setIsProgressing] = useState(false);

    async function createCategory() {
        const newCategory = {
            name: name,
            description: description,
        };

        if (category)
            newCategory.parentCategoryId = category.id;

        const result = await CategoryService.create(newCategory);
        console.log(result);
        // TODO: show error...
    }

    async function updateCategory() {
        const updatedCategory = category;
        updatedCategory.name = name;
        updatedCategory.description = description;

        const result = await CategoryService.update(updatedCategory);

        console.log(result);
        // TODO: show error...
    }

    async function deleteCategory() {
        const deleteCategory = category;
        const result = await CategoryService.delete(deleteCategory.id);

        console.log(result);
        // TODO: show error...
    }

    async function handleOnOkButtonPress() {
        // TODO: Validate name & description.
        setIsProgressing(true);

        if (mode == "create")
            await createCategory();

        if (mode == "edit")
            await updateCategory();

        if (mode == "delete")
            await deleteCategory();

        setIsProgressing(false);
        await props.onOk();
    }

    function getParentInfo() {
        if (mode == "create") {
            return (
                <Input
                    disabled={true}
                    label="Danh mục cha"
                    value={category ? category.name : "Không có (danh mục gốc)"}
                />
            )
        }
    }

    function getHeader() {
        return <CardHeader title={getTitle()} />
    }

    function getTitle() {
        if (mode === "create")
            return "Thêm";

        if (mode === "edit")
            return "Sửa";

        if (mode === "delete")
            return "Xóa";
    }

    function getFooter() {
        return (
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button appearance="ghost" onPress={props.onCancel}>Hủy</Button>
                <Button appearance="ghost" onPress={handleOnOkButtonPress}>OK</Button>
            </View>
        );
    }

    function getFormContent() {
        if (isProgressing)
            return <ActivityIndicator />

        if (props.mode == "delete") {
            return <Text>Xóa danh mục: {props.category.name}</Text>
        }

        return (
            <View>
                <Input
                    label="Tên"
                    onChangeText={setName}
                    value={name}
                />
                <Input
                    label="Chú thích"
                    onChangeText={setDescription}
                    value={description}
                />
                {getParentInfo()}
            </View>
        );
    }

    return (
        <Card
            footer={getFooter}
            header={getHeader}
        >
            {getFormContent()}
        </Card>
    )
}