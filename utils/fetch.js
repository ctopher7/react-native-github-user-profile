import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
const BASE_URL = 'https://api.github.com'

export default async (method,url,needAuthorization,header,data)=>{
    try {
        const headers = needAuthorization?{Authorization:await AsyncStorage.getItem('Authorization'),...header}:header
        const response = await Axios({
            method,
            url:`${BASE_URL}${url}`,
            headers,
            data,
            validateStatus:false
        }).catch(e=>{
            const error = new Error(e)
            throw{code:Math.random(),message:`${error.message}, please check your internet connection`}
        })
        if(response.status!==200)throw {message:response.data.message,code:response.status}
        return {code:response.status,data:response.data}
    } catch (error) {
        throw{
            code:error.code??Math.random(),
            message:error.message??'Something wrong happened'
        }
    }
}