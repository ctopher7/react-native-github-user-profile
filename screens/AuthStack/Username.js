import React,{useState,useEffect,useRef} from 'react'
import {KeyboardAvoidingView,Platform,ActivityIndicator,TouchableOpacity,Text,TextInput,Keyboard} from 'react-native'
import Splash from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage'
export default (props)=>{
    const [username,setUsername] = useState('')
    const textInputRef = useRef()

    useEffect(() => {
        _checkAuth()
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide)
        return () => {Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)};
    }, [])

    const _checkAuth = async()=>{
        const token = await AsyncStorage.getItem('Authorization')
        if(token && token != '') return props.navigation.dangerouslyGetParent().navigate('HomeStack')
        setTimeout(()=>{Splash.hide()},1000)
    }

    const _keyboardDidHide = () => textInputRef.current.blur()

    const _onBackgroundPress = ()=>Keyboard.dismiss()

    const _checker = ()=>username.split("").length>0

    const _onSubmit =()=>props.navigation.navigate('Password',{username})

    return(
        <KeyboardAvoidingView behavior='padding' >
            <TouchableOpacity 
            style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
            onPress={_onBackgroundPress}
            activeOpacity={1}
            >
                <TextInput
                placeholder ={'Enter your Github username'}
                placeholderTextColor={'grey'}
                value={username}
                onChangeText={setUsername}
                ref={textInputRef}
                style={{borderBottomWidth:0.5,borderBottomColor:'grey',width:'80%',color:'black'}}
                />
                <TouchableOpacity
                style={{
                    marginTop:30,
                    borderRadius:5,
                    backgroundColor:_checker()?'green':'grey',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'80%'
                }}
                disabled={!_checker()}
                activeOpacity={0.7}
                onPress={_onSubmit}
                >
                    <Text style={{color:'white',marginVertical:10}}>Submit</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}