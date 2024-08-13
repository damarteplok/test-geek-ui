import {loginError, loginSuccess, logoutSuccess} from "./reducer";
import {ThunkAction} from "redux-thunk";
import {Action, Dispatch} from "redux";
import {RootState} from "slices";
import {getFirebaseBackend} from "helpers/firebase_helper";
import {APIClient} from "../../../helpers/api_helper";
import {API_URL} from "../../../Common/constants/urls";
import {profileSuccess} from "../profile/reducer";

interface User {
    email: string;
    password: string;
}

const api = new APIClient();

export const loginUser = (
    user: User,
    history: any
): ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch: Dispatch) => {
    try {
        let response: any;

        response = await api.create(`${API_URL}/auth/login`, {
            email: user.email,
            password: user.password
        })

        localStorage.setItem("authUser", JSON.stringify(response));

        if (response) {
            dispatch(loginSuccess(response))
            dispatch(profileSuccess(response));
            history('/dashboard')
        }

    } catch (error) {

        dispatch(loginError(error));
    }
};

export const logoutUser = () => async (dispatch: Dispatch) => {
    try {
        localStorage.removeItem("authUser");
        dispatch(logoutSuccess(true));
    } catch (error) {
        dispatch(loginError(error));
    }
}


export const socialLogin = (type: any, history: any) => async (dispatch: any) => {
    try {
        let response: any;

        if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
            const fireBaseBackend = getFirebaseBackend();
            response = fireBaseBackend.socialLoginUser(type);
        }

        const socialData = await response;

        if (socialData) {
            sessionStorage.setItem("authUser", JSON.stringify(socialData));
            dispatch(loginSuccess(socialData));
            history('/dashboard');
        }

    } catch (error) {
        dispatch(loginError(error));
    }
}