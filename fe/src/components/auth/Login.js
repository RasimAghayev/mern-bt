import React,{Fragment, useState} from 'react'
import {Link} from 'react-router-dom'
// import axios from 'axios'

const Login = () => {
  const [formData,setFromData]=useState({
    email: '',
    password: ''
  });

  const {email,password}=formData
  const onChange=e=>setFromData({...formData, [e.target.name]: e.target.value})

  const onSubmit = async e =>{
    e.preventDefault(); 
    // if(password!==password2){
    //   console.error('Passwords do not match.')
    // }else{
      console.log('SUCCESS.')
    // }
    /*const newUser={
      name,
      email,
      password
    }
    try {
      const config={
        headers:{
          'Content-Type':'application/json'
        }
      }
      const body=JSON.stringify(newUser)
      const res=await axios.post('api/users',body,config)
      console.log(res.data);
    } catch (err) {
      console.log(err.response.data)
    }*/

  }
  return (
    <Fragment>
    <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input 
              type="email" 
              placeholder="Email Address" 
              name="email" 
              value={email}
              onChange={e=>onChange(e)}
              required 
            />
          <small className="form-text" >
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}

export default Login
