import React,{useState} from 'react'
import {TouchableOpacity,Text} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export default ({navigation})=>({
    headerRight:()=><HeaderRight navigation={navigation}/>
})

const HeaderRight = ({navigation}) =>{
    const [pressed,setPressed]=useState(false)
    return (
        <TouchableOpacity 
        onPress={async()=>{
            if(pressed) return
            setPressed(true)
            await AsyncStorage.removeItem('Authorization')
            navigation.dangerouslyGetParent().reset({
                index: 0,
                routes: [{ name: 'AuthStack' }],
            });
        }}
        style={{flex:1,justifyContent:'center'}}
        >
            <Text style={{marginHorizontal:20}}>Logout</Text>
        </TouchableOpacity>
    )
}