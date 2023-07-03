import {Container, Form, Button, Alert} from 'react-bootstrap'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import bcrypt from 'bcryptjs'

function SignUp() {
    const [message, setMessage] = useState(null)
    const [variant, setVariant] = useState(null)
    const [emailMsg, setEmailMsg] = useState(null)
    const [passwordMsg, setPasswordMsg] = useState(null)
    const [confirmMsg, setConfirmMsg] = useState(null)
    const [validated, setValidated] = useState(false)

    const validateEmail = async (email) => {
        const usersApi = await axios.get('http://localhost:3001/api/users')
        const users = usersApi.data
        const emailInUse = users.some(user => user.email === email)

        if (emailInUse) {
            setEmailMsg('Email in use.')
            return false
        } else if (email.length < 3) {
            setEmailMsg('Email must be valid.')
            return false
        } else {
            setEmailMsg('')
            return true
        }
    }

    const validatePassword = (passwordVal, confirmPasswordVal) => {
        if (passwordVal.length < 8) {
            setPasswordMsg('Password must be at least 8 characters in length.')
            return false
        } else if (passwordVal !== confirmPasswordVal) {
            setConfirmMsg('Passwords must match.')
            return false
        } else {
            setPasswordMsg('')
            setConfirmMsg('')
            return true
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const form = event.currentTarget
        const email = form['formBasicEmail'].value
        const passwordVal = form['formBasicPassword'].value
        const confirmPasswordVal = form['formBasicConfirmPassword'].value
        const username = form['formBasicName'].value
        const password = bcrypt.hashSync(passwordVal, 10)

        const isValidEmail = await validateEmail(email)
        const isValidPassword = validatePassword(passwordVal, confirmPasswordVal)

        if (isValidEmail && isValidPassword) {
            const newUser = {
                username,
                email,
                password,
            }

            await axios.post('http://localhost:3001/api/users', newUser)
            setVariant('info')
            setMessage('User created successfully!')
        }

        setValidated(true)
    }

    return (
        <Container className='text-light bg-dark p-5 mt-5' style={{maxWidth: '40vw', borderRadius: '3rem'}}>
            <h1 className='py-5'>Sign Up</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {message && (<Alert variant={variant}>{message}</Alert>)}
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control className="unique-form-control" required placeholder="Enter Name"/>
                    <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control className="unique-form-control" required placeholder="Enter Email" type='text' isInvalid={emailMsg !== ''} onBlur={(e) => validateEmail(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">{emailMsg}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className="unique-form-control" required type="password" placeholder="Password" isInvalid={passwordMsg !== ''} onBlur={(e) => validatePassword(e.target.value, form['formBasicConfirmPassword'].value)}/>
                    <Form.Control.Feedback type="invalid">{passwordMsg}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control className="unique-form-control" required type="password" placeholder="Confirm Password" isInvalid={confirmMsg !== ''} onBlur={(e) => validatePassword(form['formBasicPassword'].value, e.target.value)}/>
                    <Form.Control.Feedback type="invalid">{confirmMsg}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">Sign Up</Button>
            </Form>
            <p className="pt-5"><i>Already have an account? <a href='/login'as={Link} to='/login'>Log In.</a></i></p>
        </Container>
    )
}

export default SignUp
