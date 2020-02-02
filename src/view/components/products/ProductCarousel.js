import React, { useState } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { Dimensions } from "react-native";
import MinimalProduct from "./MinimalProduct";
import Carousel, { Pagination } from "react-native-snap-carousel";

/**
 * 
 * @param {*} props products, title, 
 */
export default function ProductCarousel(props) {

    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselRef, setCarouslRef] = useState(null);

    const { products, title } = props;
    const screenWidth = Dimensions.get("window").width;

    return (
        <Layout>
            <Text category="h6" style={{ margin: 8 }}>{title}</Text>
            <Carousel
                autoplay={true}
                autoplayDelay={500}
                autoplayInterval={3000}
                data={products}
                loop={true}
                loopClonesPerSide={2}
                itemWidth={screenWidth}
                onSnapToItem={setActiveIndex}
                ref={c => setCarouslRef(c)}
                renderItem={({ item }) => <MinimalProduct product={item} />}
                sliderWidth={screenWidth}
            />
            <Pagination
                activeDotIndex={activeIndex}
                carouselRef={carouselRef}
                dotsLength={products.length}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                tappableDots={true}
            />
        </Layout>
    );
}