import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { Button, Typography, Alert, Grid } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { BASE_URL } from './helper'

export default function Register() {
  const navigate = useNavigate()
  const [userDetails, setuserDetails] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [isSubmit, setisSubmit] = useState(false)
  const [formErrors, setformErrors] = useState({})
  const [serverAuthError, setserverAuthError] = React.useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setuserDetails({
      ...userDetails,
      [name]: value,
    })
    if (name.length > 1) {
      setformErrors({ name: null })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setformErrors(validateForm(userDetails))
    setisSubmit(true)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      try {
        // const formData = new FormData()
        // formData.append('username', userDetails.username)
        // formData.append('email', userDetails.email)
        // formData.append('password', userDetails.password)

        const response = await axios.post(`${BASE_URL}/signup`, {
          username: userDetails.username,
          email: userDetails.email,
          password: userDetails.password,
        })
        if (response.status === 200) {
          if (response.data.user && response.data.auth) {
            localStorage.setItem('users', JSON.stringify(response.data.user))
            localStorage.setItem('token', response.data.auth)
            navigate('/')
            console.log(' registered succesfully')
          } else {
            setserverAuthError(response.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  useEffect(() => {
    const auth = localStorage.getItem('users')
    if (auth) {
      navigate('/')
    }
  }, [])

  const validateForm = (values) => {
    const errors = {}

    if (values.username.length < 1) {
      errors.username = '*required'
    }

    if (values.password.length < 6) {
      errors.password = 'must be greater than 6 characters'
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
      errors.email = 'invalid email address'
    }

    return errors
  }

  return (
    <Box
      sx={{
        '& .MuiTextField-root': { mx: 1, width: '30ch' },

        backgroundColor: '#f0ebec',
        padding: '2% 3%',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2) ',
        margin: 'auto',
        marginTop: '1%',
        textAlign: 'center',
      }}
      noValidate
      autoComplete='off'
    >
      <Typography variant='h5' align='center' gutterBottom>
        REGISTER
      </Typography>
      <hr style={{ margin: '0' }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7} mt={2}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <TextField
                  error={!!formErrors.username}
                  value={userDetails.username}
                  helperText={formErrors.username ? formErrors.username : ''}
                  label='username'
                  name='username'
                  variant='standard'
                  onChange={handleChange}
                  // onChange={(e) => {
                  //   setuserDetails({
                  //     ...userDetails,
                  //     firstname: e.target.value,
                  //   })
                  // }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  // error={!!formErrors.email}
                  error={!!formErrors.email}
                  value={userDetails.email}
                  label='email'
                  name='email'
                  type='email'
                  helperText={formErrors.email ? formErrors.email : ''}
                  variant='standard'
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                {' '}
                <TextField
                  error={!!formErrors.password}
                  value={userDetails.password}
                  label='password'
                  name='password'
                  type='password'
                  helperText={formErrors.password ? formErrors.password : ''}
                  variant='standard'
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <br />{' '}
            {serverAuthError ? (
              <Alert
                severity='warning'
                variant='standard'
                sx={{
                  width: '70%',
                  justifyContent: 'center',
                  margin: 'auto',
                }}
              >
                {serverAuthError}!
              </Alert>
            ) : (
              ''
            )}
            <Button
              variant='contained'
              sx={{ display: 'block', margin: 'auto' }}
              type='submit'
            >
              Register
            </Button>
            <Link to='/login'>
              <Typography variant='body1' textAlign='center' mt={1}>
                Already have an account?
              </Typography>
            </Link>
          </form>
        </Grid>
      </Grid>
    </Box>
  )
}
