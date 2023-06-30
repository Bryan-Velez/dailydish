import {Container, Form, Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import '../App.css'
import { LoginContext } from '../App'
import { Link } from 'react-router-dom'
import axios from 'axios'
const URL = `http://localhost:3001/api`



const LogInPage=()=>{
    const contextValue = useContext(LoginContext)
    const user = contextValue.user
    const setUser = contextValue.setUser
    const signedIn = contextValue.signedIn
    const setSignedIn = contextValue.setSignedIn

    const [showLoginButton, setShowLoginButton] = useState(true)
    const [showCreateBlogs, setShowCreateBlogs] = useState(false)
    const [showDeleteBlogs, setShowDeleteBlogs] = useState(false)
    
    function handleCallbackResponse(response){
        let userObject = jwt_decode(response.credential)
        setUser(userObject)
        setSignedIn(true)
        setShowLoginButton(false)
    }

    function handleSignOut(event){
        setUser({})
        setSignedIn(false)
        setShowLoginButton(true)
    }

    useEffect(()=>{
        /* global google */
        if (showLoginButton) {
            google.accounts.id.initialize({
                client_id: '1028178874548-5tn4mc9i1db7hf9f3vo6gpv1qsolll89.apps.googleusercontent.com',
                callback: handleCallbackResponse
            })

            google.accounts.id.renderButton(
                document.getElementById("log-in-div"),
                {theme: 'outline', size: 'large'}
            )
        }
    }, [showLoginButton])


    function LoginForms({ setShowLoginButton }){
        const contextValue = useContext(LoginContext)
        const user = contextValue.user
        const setUser = contextValue.setUser
        const signedIn = contextValue.signedIn
        const setSignedIn = contextValue.setSignedIn
        const signInHandler = async()=>{
            const email = document.getElementById(`formBasicEmail`).value
            const password = document.getElementById(`formBasicPassword`).value
            console.log(email,password)
            const users = await axios.get(`${URL}/users`)
            console.log(users.data)
        
            let userFound = false
            for(let i of users.data){
                console.log(i)
                if (email == i.email){
                  if(password == i.password){
                    console.log(`Signed in!`)
                    console.log(i.name, i.email)
                    let userObject = {
                        email: i.email,
                        username: i.username
                    }
                    console.log(userObject)
                    setUser(userObject)
                    userFound = true
                    break 
                  }                    
                } 
            }
            if (userFound) {
                setSignedIn(true)
                setShowLoginButton(false)
            } else {
                alert(`Account not found. Please try again.`)
                setSignedIn(false)
                setUser({})
            }
        }
        
    
        return(
            <Container className='text-dark login-page' style={{maxWidth:`50%`}}>
                <h1 className="pt-5 pb-5">Login</h1>
                <Container className='login-container'>
                    <Form>
                        <Form.Group className="mb-3" controlId='formBasicEmail'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type='email' placeholder='Enter Email'/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId='formBasicPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' placeholder='Enter Password'/>
                            <Form.Text className='text-dark'>We'll never share your password with anyone else.</Form.Text>
                        </Form.Group>
                    </Form>
                    <Button onClick={signInHandler}>Sign In</Button>
                    <p className="pt-5"><i>Don't have an account? <a href='/SignUp'as={Link} to='/SignUp'>Sign up.</a></i></p>
                </Container>
            </Container>
        )
    }
  

    return(
        <Container>
             { (signedIn == true) ? (  
                <div style={{color: '#000', backgroundColor: '#f5f5f5', borderRadius:`1vw`}}>
                  <Container className='py-5 panel' >
                    <h1>Welcome, {user.username}!</h1>
                    <p>Email: {user.email}</p>
                    <Button variant="primary" onClick= {(e)=> handleSignOut(e)}>Sign Out</Button> 
                    {user.email === "gadailydish@gmail.com" && (
                      <>
                        <p className='py-4'>You have admin privileges.</p>
                      </>
                    )}
                  </Container>
                  <Container>
                    
                  </Container>
                  
                </div>
             
             ): 
             <>
             <LoginForms setShowLoginButton={setShowLoginButton}/>
             {showLoginButton && <Container id="log-in-div"></Container>}
             </>
             }
        </Container>
    )
}


  


export default LogInPage