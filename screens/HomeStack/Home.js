import React,{useState,useEffect,useRef,useLayoutEffect} from 'react'
import {KeyboardAvoidingView,Text,TouchableOpacity,BackHandler,TextInput,Keyboard, ActivityIndicator,Alert} from 'react-native'
import Splash from 'react-native-splash-screen'
import {connect} from 'react-redux'
import {setRepo,setRepoDetail} from '../../redux/actions/HomeStack'
import Header from '../../utils/header'
import Fetch from '../../utils/fetch'

const mapStateToProps = state =>({
    repo:state.HomeStack.repo,
    repoDetail:state.HomeStack.repoDetail
}) 

const mapDispatchToProps = dispatch =>({
    setRepo:(payload)=>dispatch(setRepo(payload)),
    setRepoDetail:(payload)=>dispatch(setRepoDetail(payload)),
})

export default connect(mapStateToProps,mapDispatchToProps)((props)=>{
    const [loading,setLoading]=useState(false)
    const textInputRef = useRef()

    useEffect(() => {
        setTimeout(()=>{Splash.hide()},1000)
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide)
        const backhandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            return true
        })
        const unsubscribe = props.navigation.addListener('blur',()=>{
            setLoading(false)
        })
        return () => {
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)
            backhandler.remove()
            unsubscribe()
        };
    }, [])

    useLayoutEffect(()=>{
        props.navigation.setOptions(Header({navigation:props.navigation}))
    },[])

    const _keyboardDidHide = () => textInputRef.current.blur()

    const _onBackgroundPress = ()=>Keyboard.dismiss()

    const _onChangeText = value =>props.setRepo(value==''?'facebook/react-native':value)

    const _onSubmit = async ()=>{
        setLoading(true)
        try {
            const response = await Fetch('GET',`/repos/${props.repo}`,true)
            props.setRepoDetail(response.data)
            props.navigation.navigate('Profile')
        } catch (e) {
            Alert.alert('Error',e.message??'Something wrong happened')
            setLoading(false)
        }
    }

    return(
        <KeyboardAvoidingView behavior='padding' >
            <TouchableOpacity
            activeOpacity={1}
            onPress={_onBackgroundPress}
            style={{alignItems:'center',justifyContent:'center',height:'100%'}}
            >
                <Text
                style={{fontSize:20,marginHorizontal:30,marginBottom:20}}
                >
                    Enter a repository name
                </Text>
                <TextInput
                placeholder ={'facebook/react-native'}
                placeholderTextColor={'grey'}
                onChangeText={_onChangeText}
                ref={textInputRef}
                style={{borderBottomWidth:0.5,width:'80%',borderBottomColor:'grey',marginHorizontal:30}}
                />
                <TouchableOpacity
                style={{
                    marginTop:30,
                    width:'80%',
                    borderRadius:5,
                    backgroundColor:loading?'grey':'green',
                    alignItems:'center',
                    justifyContent:'center'
                }}
                activeOpacity={0.7}
                onPress={_onSubmit}
                disabled={loading}
                >
                    {loading
                    ?<ActivityIndicator size={"small"} color={'white'} style={{marginVertical:10}}/>
                    :<Text style={{color:'white',marginVertical:10}}>
                        Submit
                    </Text>
                    }
                </TouchableOpacity>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
})