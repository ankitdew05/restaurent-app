import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper/src";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      "https://i.ibb.co/LYGJyQj/Screenshot-2023-08-12-14-18-13-98-fcda2657b11af9cf0a49a9d2ac2c6d74.jpg",
      "https://i.ibb.co/Ph6FD53/Screenshot-2023-08-12-14-18-00-73-fcda2657b11af9cf0a49a9d2ac2c6d74.jpg",
      "https://i.ibb.co/1Z89Km1/Screenshot-2023-08-12-14-17-36-95-fcda2657b11af9cf0a49a9d2ac2c6d74.jpg",
      
    ]);

    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{ height: width / 4 }}
            showButtons={false}
            autoplay={true}
            autoplayTimeout={4}
          >
            {bannerData.map((item) => {
              return (
                <Image
                  key={item}
                  style={styles.imageBanner}
                  resizeMode="stretch"
                  source={{ uri: item }}
                />
              );
            })}
          </Swiper>
          {/* <View style={{ height: 20 }}></View> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  imageBanner: {
    height: width / 5,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default Banner;