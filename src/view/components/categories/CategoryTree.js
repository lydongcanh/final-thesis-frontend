import React from "react";
import TreeView from "react-native-final-tree-view";
import { Layout, Icon, Text } from "@ui-kitten/components";
import { Chip, Divider } from "react-native-paper";

export default function CategoryTree() {

    const data = [
        {
            id: 'Parent1',
            name: 'Parent1',
            children: [
                {
                    id: 'child1',
                    name: 'child1',
                    children: [
                        {
                            id: 'child11',
                            name: 'child11',
                            children: [
                                {
                                    id: 'child111',
                                    name: 'child111',
                                },
                            ],
                        },
                        {
                            id: 'child12',
                            name: 'child12',
                        },
                    ],
                },
            ],
        },
        {
            id: 'Parent2',
            name: 'Parent2',
            children: [
                {
                    id: 'child2',
                    name: 'child2',
                    children: [
                        {
                            id: 'child21',
                            name: 'child21',
                        },
                        {
                            id: 'child22',
                            name: 'child22',
                        },
                    ],
                },
            ],
        },
    ];

    function getIndicator(isExpanded, hasChildrenNodes) {
        if (!hasChildrenNodes)
            return <Icon name="arrow-right-outline" />;

        if (isExpanded)
            return <Icon name="minus-outline" />;

        return <Icon name="plus-outline" />;
    }

    async function handleNodeOnPress({ node }) {
        if (!node || node.children) // Not leaf
            return;

        // TODO: Show products with matched category...
    }

    return (
        <Layout>
            <Text category="label" style={{ padding: 8 }}>Categories</Text>
            <Divider />
            <TreeView
                data={data}
                getCollapsedNodeHeight={() => 32}
                onNodePress={handleNodeOnPress}
                renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                        <Chip
                            avatar={getIndicator(isExpanded, hasChildrenNodes)}
                            mode="flat"
                            style={{ marginLeft: 16 * level, borderRadius: 0, backgroundColor: "white" }}
                        >
                            <Text>{node.name}</Text>
                        </Chip>
                    );
                }}
            />
        </Layout>
    );
}