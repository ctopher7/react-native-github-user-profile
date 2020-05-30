const defaultState={
    repo:'facebook/react-native',
    repoDetail:{}
}

export default (state=defaultState,action)=>{
    switch(action.type){
        case 'HOMESTACK_REPO':return{...state,repo:action.payload}
        case 'HOMESTACK_REPO_DETAIL':return{...state,repoDetail:action.payload}
        default:return state
    }
}