import React,{useState,useEffect,useRef} from 'react'
import {KeyboardAvoidingView,Platform,ActivityIndicator,TouchableOpacity,Text,View,TextInput,Keyboard,BackHandler,Alert} from 'react-native'
import Fetch from '../../utils/fetch'
import {Base64} from 'js-base64'
import AsyncStorage from '@react-native-community/async-storage'

export default (props)=>{
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const [visible,setVisible]=useState(false)
    const textInputRef = useRef()

    useEffect(() => {
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide)
        return () => {Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)};
    }, [])

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            if(loading) return true
        });
        return ()=>{backHandler.remove()}
    },[loading])

    const _keyboardDidHide = () => textInputRef.current.blur()

    const _onBackgroundPress = ()=>Keyboard.dismiss()

    const _checker = ()=>password.split("").length>0

    const _onSubmit =async()=>{
        setLoading(true)
        try {
            const Authorization =`Basic ${Base64.encode(`${props.route.params.username}:${password}`)}`
            await Fetch('GET','/user',false,{Authorization})
            await AsyncStorage.setItem('Authorization',Authorization)
            props.navigation.dangerouslyGetParent().navigate('HomeStack')
        } catch (e) {
            Alert.alert('Error',e.message??'Something wrong happened')
            setLoading(false)
        }
    }

    return(
        <KeyboardAvoidingView behavior='padding' >
            <TouchableOpacity 
            style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
            onPress={_onBackgroundPress}
            activeOpacity={1}
            >
                <View 
                style={{
                    borderBottomWidth:.5,
                    borderBottomColor:'grey',
                    width:'80%',
                    flexDirection:'row',
                    alignItems:'center'
                }}
                >
                    <TextInput
                    placeholder ={'Enter your Github password'}
                    placeholderTextColor={'grey'}
                    value={password}
                    onChangeText={setPassword}
                    ref={textInputRef}
                    secureTextEntry={!visible}
                    editable={!loading}
                    style={{flex:.8}}
                    />
                    <TouchableOpacity
                    activeOpacity={.7}
                    onPress={setVisible.bind(null,!visible)}
                    style={{flex:.2,alignItems:'center'}}
                    >
                        <Text>
                            {visible?'Hide':'Show'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                style={{
                    marginTop:30,
                    borderRadius:5,
                    backgroundColor:_checker()&&!loading?'green':'grey',
                    alignItems:'center',
                    justifyContent:'center',
                    width:'80%'
                }}
                disabled={!_checker()||loading}
                activeOpacity={.7}
                onPress={_onSubmit}
                >
                    {loading
                    ?<ActivityIndicator size={"small"} color={'white'} style={{marginVertical:10}} />
                    :<Text style={{color:'white',marginVertical:10}}>Submit</Text>
                    }
                </TouchableOpacity>
            </TouchableOpacity>
        </KeyboardAvoidingView>
        
    )
}