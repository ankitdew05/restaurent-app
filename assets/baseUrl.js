import { Platform } from 'react-native'

let baseURL = 'http://10.43.1.191:5000/api/v1/'
//let baseURL = 'https://squid-app-pzxr7.ondigitalocean.app/api/v1/'

/*{Platform.OS == 'android'
? baseURL = 'http://192.168.137.213:5000/api/v1/'
: baseURL = 'http://localhost:5000/api/v1/'
}*/

export default baseURL;