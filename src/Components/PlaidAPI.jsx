import React, { useEffect, useState } from "react";
import axios from 'axios'
import { PlaidLink } from 'react-plaid-link';
import plaid from "plaid";

import "./CSS/Plaid.scss";


const PlaidAPI = () => {

  const [user, setUser] = useState({
    email: "",
    pass: ""
  })

  const [link_token, setLinkToken] = useState("link-sandbox-d2c55cba-bf02-4539-aeaa-dd56d8486486")

  const enteringUser = (event) => {

    const { name, value } = event.target;

    setUser((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }

  const submit = async (data) => {
    data.preventDefault();
    let url = "http://localhost:8080/register/";
    let email = user.email;
    let pass = user.pass

    axios.post(url, { email, pass }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log("Something Went Wrong == ", err)
    })
  }

  const createlinktoken = async () => {
    console.log("CKICKED!!!!!!!")
    let url = "http://localhost:8080/create_link_token";

    axios.post(url).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log("Something Went Wrong CREATE LINK TOKEN == ", err)
    })
  }

  const getAccessToken = async (public_token , data)=>{
    console.log("The PublicToken ========= " , public_token)
    console.log("The PublicToken's DATA ========= " , data)

    let url = "http://localhost:8080/create_link_token";

    axios.post(url).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log("Something Went Wrong CREATE LINK TOKEN == ", err)
    })
  }

  return (
    <>
      <div className="plaidapi_container">
        <form onSubmit={submit}>
          <input type="email" placeholder="Enter Your Email" name="email" onChange={enteringUser} />
          <input type="text" placeholder="Enter Password" name="pass" onChange={enteringUser} />
          <input type="submit" value="Register" />
          {user.email}
          <hr />
          {user.pass}
        </form>

        <h3> <button onClick={createlinktoken}> Create Link Token </button> </h3>

        <br />
        <hr />

        <h3>
          <PlaidLink
            style={{padding:".5rem" , margin:".5rem 0"}}
            token={link_token}
            onSuccess={(public_token , data)=>{
              getAccessToken(public_token , data)
            }}
          >
            LINK ACCOUNT
          </PlaidLink>
        </h3>
      </div>
    </>
  );
};

export default PlaidAPI;
