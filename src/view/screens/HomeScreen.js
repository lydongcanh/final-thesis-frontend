import React, { useState } from "react";
import { Dimensions, FlatList, ScrollView } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import products from "../../../test/mockData/products.json";
import MinimalProduct from "../components/products/MinimalProduct.js";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Divider } from "react-native-elements";

export default function HomeScreen() {

    const [carouselRef, setCarouslRef] = useState(null);

    const screenWidth = Dimensions.get("window").width;

    return (
        <ScrollView>
            <Layout style={{ backgroundColor: "#f2f2f2" }}>
                <Text category="h6" style={{ margin: 8 }}>Hot</Text>
                <Carousel
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    data={products}
                    itemWidth={screenWidth}
                    ref={c => setCarouslRef(c)}
                    renderItem={({ item }) => <MinimalProduct product={item} />}
                    sliderWidth={screenWidth}
                />
                <Pagination
                    carouselRef={carouselRef}
                    dotsLength={products.length}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1.2}
                    tappableDots={carouselRef}
                />
                <Divider style={{ margin: 8 }} />
                <Text category="h6" style={{ margin: 8 }}>All Products</Text>
                <FlatList
                    data={products}
                    keyExtractor={() => Math.random()}
                    numColumns={2}
                    renderItem={({ item }) => <MinimalProduct product={item} />}
                    style={{ flexWrap: "wrap" }}
                />
            </Layout>
        </ScrollView>
    )
}