import * as React from 'react'
import Box from '@mui/material/Box'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { Button, IconButton, Typography, Alert } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { BASE_URL } from './helper'

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setemail] = React.useState('')
  const [password, setpassword] = React.useState('')
  const [formErrors, setformErrors] = React.useState({})
  const [isSubmit, setisSubmit] = React.useState(false)
  const [serverAuthError, setserverAuthError] = React.useState('')

  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const handleLogin = async () => {
    setformErrors(validateForm(email, password))
    setisSubmit(true)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          email,
          password,
        })

        if (response.status === 200) {
          if (response.data.user && response.data.auth) {
            localStorage.setItem('users', JSON.stringify(response.data.user))
            localStorage.setItem('token', response.data.auth)
            navigate('/')
            console.log('login succesfull')
          } else {
            setserverAuthError(response.data)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  const validateForm = (email, password) => {
    const errors = {}
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.email = 'invalid email address'
    }
    if (password.length < 6) {
      errors.password = 'must be greater than 6 characters'
    }
    return errors
  }
  React.useEffect(() => {
    const auth = localStorage.getItem('users')
    if (auth) {
      navigate('/')
    }
    return () => {
      const islogged = localStorage.getItem('users')
      if (islogged) {
        console.log('congrats!  you are logged in')
      }
    }
  }, [])
  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
        backgroundColor: '#f5f5f5',
        padding: '3% 0% 1% 0%',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2) ',
        margin: 'auto',
        marginTop: '2%',
        textAlign: 'center',
      }}
    >
      <Typography variant='h5' align='center'>
        SIGN IN
      </Typography>
      <hr style={{ marginBottom: '3%' }} />

      <Box sx={{ alignItems: 'center' }}>
        <TextField
          sx={{ width: '35ch' }}
          id='input-with-sx'
          label='Email'
          value={email}
          name='email'
          variant='standard'
          onChange={(e) => {
            setemail(e.target.value)
            if (e.target.value.length > 1) {
              setformErrors({ email: null })
            }
          }}
        />
      </Box>
      <Typography variant='caption' color='error' component='h6'>
        {formErrors.email ? formErrors.email : ''}
      </Typography>
      <FormControl sx={{ m: 1, width: '35ch' }} variant='standard'>
        <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>

        <Input
          // id='standard-adornment-password'
          name='password'
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => {
            setpassword(e.target.value)
            if (e.target.value.length > 1) {
              setformErrors({ password: null })
            }
          }}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Typography variant='caption' color='error' component='h6'>
        {formErrors.password ? formErrors.password : ''}
      </Typography>
      {serverAuthError ? (
        <Alert
          severity='error'
          variant='outlined'
          sx={{
            width: '70%',
            display: 'inline-flex',
          }}
        >
          {serverAuthError}!
        </Alert>
      ) : (
        ''
      )}

      <br />
      <Button
        variant='contained'
        style={{
          display: 'block',
          margin: 'auto',
          marginTop: '0%',
          width: '36ch',
        }}
        onClick={handleLogin}
      >
        Login
      </Button>
      <Link to='/register'>
        <Typography variant='body1' textAlign='center' mt={1}>
          Don't have an account?
        </Typography>
      </Link>
    </Box>
  )
}
