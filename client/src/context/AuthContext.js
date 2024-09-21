import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    // user : {
    //     _id: "66cdbcb64cc724c52c460c80",
    //     username:"test00",
    //     email :"test00@gmail.com",
    //     profilePicture : "user/user7.jpg",
    //     coverPicture: "user/user9.jpg",
    //     isAdmin : false,
    //     followers : [],
    //     followings : []
    // },
    user:JSON.parse(localStorage.getItem("user")) || null,
    isFetching : false,
    error : false,
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)


    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(state.user))
      },[state.user]) 

    
    return (
        <AuthContext.Provider
        value={{
            user : state.user,
            isFetching : state.isFetching,
            error : state.error,
            dispatch
        }}
        >
        {children}

        </AuthContext.Provider>
    );
};