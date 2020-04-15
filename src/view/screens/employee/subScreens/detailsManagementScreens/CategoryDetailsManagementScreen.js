import React, { useState } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { CategoryService } from "../../../../../core/services";
import DetailsManagementTemplateScreen from "./DetailsManagementTemplateScreen";

export default function CategoryDetailsManagementScreen({ route }) {

    //const { parentNode } = route;

    const [name, setName] = useState();
    const [description, setDescription] = useState();
    
    async function createCategory() {
        return { error: "Dang cap nhat" };
    }

    async function updateCategory() {
        return { error: "Dang cap nhat" };
    }

    function resetInputValues() {
        setName("");
        setDescription("");
    }

    function canAdd() {
        return name && name !== "" &&
               description && description !== "";
    }

    function getContentUI() {
        return (
            <Layout>
                <Text>Category</Text>
            </Layout>
        );
    }

    return (
        <DetailsManagementTemplateScreen 
            route={route}
            createFunction={createCategory}
            updateFunction={updateCategory}
            resetInputFunction={resetInputValues}
            canAdd={canAdd}
            contentUI={getContentUI()}
        />
    );
}