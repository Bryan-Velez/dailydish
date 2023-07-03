import {Container, Form, Button, Tab, Tabs, Nav, Row, Col, Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useEffect, useState, useContext } from 'react'
import jwt_decode from 'jwt-decode'
import '../App.css'
import { LoginContext } from '../App'
import { Link } from 'react-router-dom'
import axios from 'axios'
import bcrypt from 'bcryptjs'

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
        localStorage.setItem('user', JSON.stringify({}))
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

    const [errorMsg, setErrorMsg] = useState(null)

    function LoginForms({ setShowLoginButton }){
        const contextValue = useContext(LoginContext)
        const user = contextValue.user
        const setUser = contextValue.setUser
        const signedIn = contextValue.signedIn
        const setSignedIn = contextValue.setSignedIn

        const signInHandler = async()=>{
            const email = document.getElementById(`formBasicEmail`).value
            const passwordVal = document.getElementById(`formBasicPassword`).value
            const users = await axios.get(`${URL}/users`)
            let userFound = false
            for(let i of users.data){
                
                if (email == i.email){
                  let hash = i.password
                  let isMatch = bcrypt.compareSync(passwordVal, hash)
                  if(isMatch){
                    console.log(`Signed in!`)
                    let userObject = {
                        email: i.email,
                        username: i.username,
                        role: i.role,
                        address: i.address,
                        strip_id: i.strip_id,
                        selected_plan: i.selected_plan
                    }
                    console.log("User object", userObject)
                    setUser(userObject)
                    localStorage.setItem('user', JSON.stringify(userObject))
                    userFound = true
                    break 
                  }                    
                } 
            }
            if (userFound) {
                setSignedIn(true)
                setShowLoginButton(false)
            } else {
                setSignedIn(false)
                setUser({})
                setErrorMsg('Account not found. Please try again.')
            }
        }
        
        return(
            <Container className='text-dark login-page' style={{maxWidth:`50%`}}>
                <h1 className="pt-5 pb-5">Login</h1>
                <Container className='login-container'>
                {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}
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
                <div style={{display:`flex`, flexDirection:`row`,color: '#000', backgroundColor: '#f5f5f5', borderRadius:`0.3vw`}} className='px-3'>
                  <Tab.Container id="left-tabs-example" defaultActiveKey="second" className='p-4'>
                    <Row style={{width:`200vw`}}>
                      <Col sm={3} className='p-0'>
                        <Nav variant="pills" className="flex-column">
                          <Nav.Item>
                            <Nav.Link eventKey="first">Profile</Nav.Link>
                          </Nav.Item>
                          {user.role === 'admin' && (
                            <Nav.Item>
                              <Nav.Link eventKey="second">Admin Panel</Nav.Link>
                            </Nav.Item>
                          )}
                          <Nav.Item>
                            <Nav.Link eventKey="third">Account Settings</Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </Col>
                      <Col sm={9} className='p-0'>
                        <Tab.Content>
                          <Tab.Pane eventKey="first">
                            <Container className='py-4 panel'>
                              <div className=''>
                                <h1>Profile</h1>
                              </div>
                              <div className='panel-profile'>
                                <p>Email: {user.email}</p>
                                <p>Name: {user.username}</p>
                                {user.role === 'admin' && (
                                    <p className='py-4'>You have admin privileges.</p>
                                )}
                                <Button variant="danger" onClick= {(e)=> handleSignOut(e)}>Sign Out</Button> 
                              </div>
                            </Container>
                          </Tab.Pane>
                          
                            <Tab.Pane eventKey="second">
                              <Container className='py-4 panel'>
                                  <h1>Admin Panel</h1>
                                  <Tabs defaultActiveKey="Dashboard" className="mb-3">
                                    <Tab eventKey="Dashboard" title="Dashboard">
                                      <Dashboard/>
                                    </Tab>
                                    <Tab eventKey="Users" title="Users">
                                      Tab content for Users
                                    </Tab>
                                    <Tab eventKey="Plans" title="Plans">
                                      Tab content for Plans
                                    </Tab>
                                    <Tab eventKey="Meals" title="Meals">
                                      Tab content for Meals
                                    </Tab>
                                  </Tabs>
                              </Container>
                            </Tab.Pane>

                          <Tab.Pane eventKey="third">
                            <div className='py-4 panel'>
                              <h1>Account Settings</h1>
                            </div>
                          </Tab.Pane>
                        </Tab.Content>
                      </Col>
                    </Row>
                  </Tab.Container>
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

function Dashboard(){

  const orders = [
    {
      name: `John Doe`,
      email: 'johndoe@email.com',
      price: 58.90,
      date: new Date(),
      id: 122,
      status: `Delivered`
    },
    {
      name: `Jane Doe`,
      email: 'janedoe@email.com',
      price: 97.34,
      date: new Date(),
      id: 132,
      status: `Canceled`
    },
    {
      name: `Jack Doe`,
      email: 'jackdoe@email.com',
      price: 142.4,
      date: new Date(),
      id: 133,
      status: `Pending`
    },

  ]

  return(
    <Container>
      <Row>
        <Col>
          <div className='dash-item'>
            <p className='text-muted my-0 py-1'>Total Sales</p>
            <p>$19,232,435</p>
          </div>
        </Col>
        <Col>
          <div className='dash-item'>
            <p className='text-muted  my-0 py-1'>Total Orders</p>
            <p>3242</p>
          </div>
          </Col>
        <Col>
          <div className='dash-item'>
            <p className='text-muted  my-0 py-1'>Total Products</p>
            <p>9</p>
          </div>
        </Col>
      </Row>
      <Row className='py-4'>
        <Col>
          <div className='dash-item'>
            <h5>Latest Orders</h5>
              {orders.map((order,index)=>(
                <Container fluid='sm' key={index} style={{borderBottom: `0.001vh solid rgba(0, 0, 0, 0.318)`}}>
                  <Row className='py-0 pt-3 my-0'>
                    <Col xs={1}>
                      <p>{order.id}</p>
                    </Col>
                    <Col>
                      <p>{order.name}</p>
                    </Col>
                    <Col>
                      <p className='text-muted'>{order.email}</p>
                    </Col>
                    <Col xs={2}>
                      <p>${order.price}</p>                  
                    </Col>
                    <Col>
                      <p>{order.date.toDateString()}</p>                  
                    </Col>
                    <Col>
                      <p className={order.status}>{order.status}</p>
                    </Col>
                  </Row>
                </Container>
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LogInPage