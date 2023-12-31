import jwt_decode from "jwt-decode"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import baseURL from "../../assets/baseUrl"

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user, dispatch) => {
    fetch(`${baseURL}users/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                const token = data.token;
                AsyncStorage.setItem("jwt", token)
                AsyncStorage.setItem("user", JSON.stringify(user))
                const decoded = jwt_decode(token)
                console.log(user, "user")
                dispatch(setCurrentUser(decoded, user))
            } else {
                logoutUser(dispatch)
            }
        })
        .catch((err) => {
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Please provide correct credentials",
                text2: " "
            });
            logoutUser(dispatch)
        });
};

export const checkAuthToken = async (dispatch) => {
    const token = await AsyncStorage.getItem("jwt");
    const user = await AsyncStorage.getItem("user");
    console.log("token",token)
    if (token) {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        console.log(decoded.exp < currentTime)
        if (decoded.exp < currentTime) {
            // Token expired, log out user
            logoutUser(dispatch);
        } else {
            console.log(user)
            // Token still valid, set current user
            console.log( dispatch(setCurrentUser(decoded, JSON.parse(user))))
            dispatch(setCurrentUser(decoded, JSON.parse(user))); // Parse the user string to JSON
        }
    }

};

export const getUserProfile = (_id) => {
    fetch(`${baseURL}users/${_id}`, {
        method: "GET",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    })
        .then((res) => res.json())
        .then((data) => console.log(data));
}

export const logoutUser = (dispatch) => {
    AsyncStorage.removeItem("jwt");
    dispatch(setCurrentUser({}))
}

export const setCurrentUser = (decoded, user) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        userProfile: user
    }
}

