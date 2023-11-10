import {
  View,
  Text,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import React from "react";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from "axios";
import baseURL from "../../assets/baseUrl";
import Icon from "react-native-vector-icons/MaterialIcons";
var { width } = Dimensions.get("window");

const ProductCard = (props) => {

  const handlevideoCall = () => {
    const data = {
      token: props.item.user.pushToken,
      title: `Hello, ${props.item.user.name}! Video verification has started by the admin. Please join the call from your admin panel. .`,
      description: `Join the video call for verification to ensure seamless connection with your trading sathi. Don't miss out on potential connections based on your taken courses (${props.item.courses})..`
    }

    axios.post(`${baseURL}test-send`, data).then((res) => {
      if (res.status == 200 || res.status == 201) {
        console.log('PushToken Sussesfull')
        //Alert.alert("Error to Send PushToken", error)
      }
    })
      .catch((error) => {
        Alert.alert("Error to Send PushToken", error)
      })
    props.navigation.navigate("VideoCall", { props: props })
  }
  const verifyProduct = () => {
    axios.put(`${baseURL}products/isVerify/${props.item.id}`).then((res) => {
      Alert.alert(`Verification Status ${res.data.status}`)
      if (!props.item.isVerified) {
        const data = {
          token: props.item.user.pushToken,
          title: `Hello, ${props.item.user.name}! Your profile is Succesfully Verified .`,
          description: `Sit back, relax, and let your trading sathi find you based on your taken courses if they match their interests ${props.item.courses}.`
        }

        axios.post(`${baseURL}test-send`, data).then((res) => {
          if (res.status == 200 || res.status == 201) {
            console.log('PushToken Sussesfull')
            //Alert.alert("Error to Send PushToken", error)
          }
        })
          .catch((error) => {
            Alert.alert("Error to Send PushToken", error)
          })
      } else {
        const data = {
          token: props.item.user.pushToken,
          title: `Hello, ${props.item.user.name}! Your profile has been marked as unverified.`,
          description: `Please verify your profile again to continue connecting with trading sathis based on your taken courses and their interests (${props.item.courses})..`
        }

        axios.post(`${baseURL}test-send`, data).then((res) => {
          if (res.status == 200 || res.status == 201) {
            console.log('PushToken Sussesfull')
            //Alert.alert("Error to Send PushToken", error)
          }
        })
          .catch((error) => {
            Alert.alert("Error to Send PushToken", error)
          })
      }

      props.navigation.navigate('Admin')
      console.log(res.data)
    }).catch((err) => {
      Alert.alert("Not able to verify")

      console.log(err)
    })
  }
  console.log("hi", props.isAnkit)
  const { name, price, image, isVerified, countInStock, courseInterest, courses } = props.item;
  return (
    <>
      <View style={StyleSheet.container}>
        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            resizeMode="cover"
            source={{
              uri: image
                ? image
                : "https://klemobucket.s3.ap-northeast-1.amazonaws.com/Avatar+(2).png",
            }}
          />
          {isVerified ? (
            <View style={styles.verifiedBadge}>

              <Image
                style={styles.verifiedIcon}
                resizeMode="contain"
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/7595/7595571.png" }} // Replace with your verified icon image source
              />
            </View>) : null}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {name.length > 25 ? name.substring(0, 15 - 3) + "..." : name}
            </Text>
            <Text style={styles.coursesTaken}>{courses}</Text>
            {/* <Text style={styles.coursesTaken}>{courseInterest}r</Text> */}

          </View>
          <View style={{}}>
            {props.isAnkit === "true" ? (
              <View style={{ flex: 1, flexDirection: "row" }}>
                {isVerified ? (
                  <EasyButton
                    primary
                    onPress={verifyProduct}
                  >
                    <Icon name='verified' size={20} />
                    {/* <Text style={{ color: 'white' }}>Verified</Text> */}
                  </EasyButton>) : (<><EasyButton
                    secondary
                    onPress={verifyProduct}
                  >
                    <Icon name='verified' size={20} />
                  </EasyButton>
                    <EasyButton
                      primary
                      onPress={handlevideoCall}>
                      <Icon name='videocam' size={20} />
                    </EasyButton></>
                )}

              </View>) : <EasyButton
                primary
                //style={{ width: 73}}

                onPress={() =>
                  props.navigation.navigate("Single Product", { item: props.item })
                }
              >
                <Icon name='person-add' size={20} />

              </EasyButton>
            }

            

          </View>
          <View style={{}}>

          </View>
        </View>
        <View style={styles.card} />


      </View>
    </>

  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 10
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 20,
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  verifiedBadge: {
    position: 'absolute',
    top: -8,
    left: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
  },
  verifiedIcon: {
    width: 18,
    height: 18,
  },
  profileName: {
    fontSize: 18,
    color: '#474747',
    fontWeight: "bold",
  },
  coursesTaken: {
    fontSize: 14,
    color: "#707070",
  },
  card: {
    // Styles for the card component
  },
  title: {
    // Styles for the title
  },
  price: {
    // Styles for the price
  },
});


// const styles = StyleSheet.create({
//   container: {
//     width: width / 2 - 20,
//     height: width / 1.7,
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 55,
//     marginBottom: 5,
//     marginLeft: 10,
//     alignItem: "center",
//     elevation: 8,
//     backgroundColor: "white",
//   },
//   image: {
//     width: width / 2 - 20 - 10,
//     height: width / 2 - 20 - 30,
//     backgroundColor: "transparent",
//     position: "absolute",
//     top: -45,
//   },
//   card: {
//     marginBottom: 10,
//     height: width / 2 - 20 - 90,
//     backgroundColor: "transparent",
//     width: width / 2 - 20 - 10,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   price: {
//     fontSize: 20,
//     textAlign: "center",
//     marginBottom: 10,
//     color: "orange",
//     marginTop: 10,
//   },
// });

export default connect(null, mapDispatchToProps)(ProductCard);
