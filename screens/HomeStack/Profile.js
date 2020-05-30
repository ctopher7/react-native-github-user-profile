import React,{useLayoutEffect,useEffect,useState} from 'react'
import {FlatList,Text,View,Alert,StyleSheet,ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import Header from '../../utils/header'
import Fetch from '../../utils/fetch'
import Shimmer from 'react-native-shimmer-placeholder'
import Image from 'react-native-fast-image'

const mapStateToProps = state =>({
    repoDetail:state.HomeStack.repoDetail
})

export default connect(mapStateToProps)((props)=>{
    const [loading,setLoading]=useState(false)
    const [data,setData]=useState([])
    const [page,setPage]=useState(0)
    const [endReached,setEndReached]=useState(false)
    const [fetchingMore,setFetchingMore]=useState(false)
    const url = props.repoDetail.commits_url.split("api.github.com")[1].split("{/sha")[0]

    useLayoutEffect(()=>{
        props.navigation.setOptions({
            ...Header({navigation:props.navigation}),
            headerTitle:props.repoDetail.full_name
        })
    },[])

    useEffect(()=>{
        _fetchData()
    },[])

    const _fetchData=async()=>{
        setLoading(true)
        setData([])
        try {
            const response = await Fetch('GET',url,true)
            setPage(1)
            setData(processData(response.data,1))
        } catch (error) {
            Alert.alert('Error',error.message??'Something wrong happened')
        } finally{setLoading(false)}
    }

    const _keyExtractor =(data)=>data.id.toString()

    const _renderItem=({item,index})=>(<>
        {loading?<LoadingRow index={index}/>:<DataRow data={item} index={index}/>}
    </>)

    const _onEndReached=async()=>{
        if(data.length>0&&!loading&&page>=1&&!fetchingMore&&!endReached){
            setFetchingMore(true)
            try {
                const response = await Fetch('GET',`${url}?page=${page+1}`,true)
                if(response.data.length<=0)setEndReached(true)
                setData([...data,...processData(response.data,page+1)])
                setPage(page+1)
            } catch (error) {
                Alert.alert('Error',error.message??'Something wrong happened')
            } finally{setFetchingMore(false)}
        }
    }

    return(
        <FlatList
        data={loading&&data.length<3?[{id:-1},{id:-2},{id:-3}]:data}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        ItemSeparatorComponent={()=><Separator/>}
        ListEmptyComponent={()=><EmptyComponent props={props}/>}
        onEndReached={_onEndReached}
        onEndThreshold={0}
        ListFooterComponent={()=><FooterComponent endReached={endReached} data={data}/>}
        scrollToOverflowEnabled={false}
        scrollEnabled={!loading}
        />
    )
})

const DataRow = ({data})=>{
    const [status,setStatus] = useState('loading')

    return <View style={styles.rowContainer}>
        <View style={{flex:2,alignItems:'center'}}>
            {data.committer.avatar_url&&<>
                <Image source={{uri:data.committer.avatar_url}} onLoadEnd={()=>setStatus('ok')} onError={()=>setStatus('error')} style={{height:50,width:50}}/>
                {status=='loading'&&<Shimmer autoRun height={50} width={50} style={{borderRadius:1,position:'absolute'}}/ >}
                {status=='error'&&<Text style={{position:'absolute'}}>Error</Text>}
            </>
            }
        </View>
        <View style={{flex:8,paddingLeft:20}}>
            <Text>committer: {data.committer.login??'no data'}</Text>
            <Text>time: {data.commit.committer.date}</Text>
            <Text>message: {data.commit.message}</Text>
        </View>
    </View>
}

const FooterComponent=({endReached,data})=>
<View style = {{height:100,width:'100%',justifyContent:'center',alignItems:'center'}}>
    {data.length==0
    ?<View/>
    :endReached
    ?<Text style={{color:'grey',fontSize:18}}>All data have been displayed</Text>
    :<ActivityIndicator size={'large'} color="grey"/>}
</View>

const LoadingRow = (props)=>
<View style={styles.rowContainer}>
    <View style={{flex:2,alignItems:'center'}}>
        <Shimmer autoRun height={50} width={50} style={{borderRadius:1}} />
    </View>
    <View style={{flex:8}}>
        <Shimmer autoRun height={20} width={200} style={{borderRadius:4,marginLeft:20}} />
    </View>
</View>

const Separator=()=> <View style={styles.separator}/>

const EmptyComponent=()=>
<View style={{alignItems:'center',justifyContent:'center'}}>
    <Text style={{textAlign:'center',marginTop:'60%',color:'grey'}}>
        Uh oh! It's empty
    </Text>
</View>

const processData=(data,page)=>data.map((item,index)=>
    ({
        id:index+(30*(page-1)),
        commit:{committer:item.commit.committer,message:item.commit.message},
        committer:{
            avatar_url:item.committer?.avatar_url??null,
            login:item.committer?.login??null
        }
    })
)

const styles = StyleSheet.create({
    container:{
        height:'100%',
        backgroundColor:'white',
    },
    rowContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:5
    },
    separator:{
        width:'100%',
        borderTopWidth:1,
        borderTopColor:'lightgrey'
    }
})