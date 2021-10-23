import Axios from "axios";

import { API_URL } from "../../data/API";

//LOGIN
export const LoginAction = (
  dispatch,
  inputValues,
  setInputValues,
  resMessage,
  setResMessage
) => {
  //Send request to backend
  Axios.post(`${API_URL}/users/login`, {
    email: inputValues.email,
    password: inputValues.password,
  })
    .then((res) => {
      if (res.data.errMessage) {
        setResMessage({ ...resMessage, error: res.data.errMessage });
      } else {
        //delete password user
        delete res.data.dataLogin.password;

        //Save token to local storage -- keep user login
        localStorage.setItem("token_parshare", res.data.token);

        //Set global state
        dispatch({
          type: "USER_LOGIN",
          payload: res.data.dataLogin,
        });

        console.log(
          `User '${res.data.dataLogin.username}' successfully logged in`
        );

        //Reset form input (controlled form)
        setInputValues({ email: "", password: "" });
      }
    })
    .catch((err) =>
      setResMessage({
        ...resMessage,
        error: "Server error, please try again later",
      })
    );
};

//KEEP LOGIN
export const KeepLoginAction = (dispatch, userLocalStorage) => {
  Axios.post(
    "http://localhost:2200/users/keep-login",
    {},
    {
      headers: {
        Authorization: `Bearer ${userLocalStorage}`,
      },
    }
  )
    .then((res) => {
      //delete password user
      delete res.data.dataLogin.password;

      //Save token to local storage -- keep user login
      localStorage.setItem("token_parshare", res.data.token);

      //Set global state
      dispatch({
        type: "USER_LOGIN",
        payload: res.data.dataLogin,
      });

      console.log(
        `Data from token matches the database, keep user '${res.data.dataLogin.username}' logged in`
      );
    })
    .catch((err) => console.log(err));
};

//CHECK LOCAL STORAGE
export const CheckStorageAction = (dispatch) => {
  dispatch({
    type: "CHECK_STORAGE",
  });
};

export const logoutAction = (dispatch) => {
  localStorage.removeItem("token_parshare");

  dispatch({
    type: "USER_LOGOUT",
  });
};

export const editProfileAction = (dispatch,inputValues,setInputValues,resMessage,setResMessage) => {
  Axios.patch(`${API_URL}/users/updateprofile`, {
    id_user : inputValues.id_user,
    fullname : inputValues.fullname,
    gender : inputValues.gender,
    birthdate : inputValues.birthdate,
    address : inputValues.address,
    picture_link : inputValues.picture_link
  })
  .then((result) => {
    if (result.data.errMessage) {
      setResMessage({ ...resMessage, error: result.data.error });
    } else{
      console.log(result.data)
      dispatch({
        type: "UPDATE_PROFILE",
        payload : result.data.data
      })
      localStorage.setItem("token_parshare", result.data.token)
  
      setResMessage({ 
        success: true
      });
    }
  })
  .catch((err) => {
    setResMessage({
      ...resMessage,
      error: "Server error, please try again later",
    })
  })
}

export const editProfilePict = (dispatch,inputValues,setInputValues,resMessage,setResMessage) => {
  let {id_user,fullname,gender,birthdate,address,picture_link} = inputValues
  let formData = new FormData();
  let obj = {
    id_user
  }

  console.log(`input data : ${picture_link}`)
  console.log(`obj : ${obj.id_user}`)

  formData.append('data',JSON.stringify(obj))
  formData.append('file',picture_link)

  Axios.patch(`${API_URL}/users/uploadprofile`, formData)
  .then((result) => {
    if (result.data.errMessage) {
      setResMessage({ ...resMessage, error: result.data.error });
    } else{
      console.log(result.data)
      dispatch({
        type: "UPDATE_PROFILE_PICTURE",
        payload : result.data.data
      })
      localStorage.setItem("token_parshare", result.data.token)
  
      setResMessage({ 
        success: true
      });
    }
  })
  .catch((err) => {
    setResMessage({
      ...resMessage,
      error: "Server error, please try again later",
    })
  })
}