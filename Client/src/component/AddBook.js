import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Alert } from '@mui/material'
import axios from 'axios'
import { Button, Grid, Typography } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { useNavigate } from 'react-router-dom'
import noPhoto from '../assets/noPhoto.jpg'
import { BASE_URL } from './helper'

export default function AddBook() {
  const navigate = useNavigate()
  const [bookInfo, setbookInfo] = useState({
    bookName: '',
    author: '',
    genre: '',
    description: '',
    photo: null,
  })

  const [isSubmit, setisSubmit] = useState(false)
  const [formErrors, setformErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    setbookInfo({
      ...bookInfo,
      [name]: value,
    })
    if (name.length > 1) {
      setformErrors({ name: null })
    }

    // var src = URL.createObjectURL(event.target.files[0]);
    // imgRef.current.src = src;
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setformErrors(validateForm(bookInfo))
    setisSubmit(true)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      try {
        const userId = JSON.parse(localStorage.getItem('users'))._id
        if (userId) {
          const formData = new FormData()
          formData.append('bookName', bookInfo.bookName)
          formData.append('author', bookInfo.author)
          formData.append('genre', bookInfo.genre)
          formData.append('userId', userId)
          formData.append('photo', bookInfo.photo)
          formData.append('description', bookInfo.description)
          console.log(userId)

          const response = await axios.post(`${BASE_URL}/addBook`, formData, {
            headers: {
              authorization: `bearer ${localStorage.getItem('token')}`,
            },
          })

          if (response.status === 200) {
            console.log('uploaded succesfully')
            navigate('/')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const validateForm = (values) => {
    const errors = {}

    if (!values.photo) {
      errors.photo = '*required'
    }
    if (!values.author) {
      errors.author = '*required'
    }

    if (values.bookName.length < 1) {
      errors.bookName = '*required'
    }
    if (values.genre.length < 1) {
      errors.genre = '*required'
    }
    if (values.description.length < 1) {
      errors.description = '*required'
    }

    return errors
  }
  return (
    <Box
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },

        backgroundColor: '#f0ebec',
        padding: '2% 2%',
        width: '95%',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2) ',
        margin: 'auto',
        marginTop: '1%',
        textAlign: 'center',
      }}
      noValidate
      autoComplete='off'
    >
      <Typography variant='h5' align='center'>
        Upload Book
      </Typography>
      <hr />
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <img
            src={bookInfo.photo ? URL.createObjectURL(bookInfo.photo) : noPhoto}
            alt='bookPhoto'
            height='300px'
            width='400px'
            style={{ marginTop: '20px' }}
          />
          <div>
            <Button component='label' startIcon={<AddAPhotoIcon />}>
              <input
                hidden
                accept='image/png, image/jpeg, image/jpg'
                type='file'
                name='photo'
                onChange={(e) =>
                  setbookInfo({ ...bookInfo, photo: e.target.files[0] })
                }
              />
              upload book
            </Button>
            &nbsp;
            {!!bookInfo.photo ? (
              ''
            ) : (
              <p style={{ color: 'red' }}>{formErrors.photo}</p>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!formErrors.bookName}
                value={bookInfo.bookName}
                helperText={formErrors.bookName ? formErrors.bookName : ''}
                label='name of book'
                name='bookName'
                variant='standard'
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!formErrors.author}
                value={bookInfo.author}
                helperText={formErrors.author ? formErrors.author : ''}
                label='author of book'
                name='author'
                variant='standard'
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!formErrors.genre}
                value={bookInfo.genre}
                helperText={formErrors.genre ? formErrors.genre : ''}
                label='genre of book'
                name='genre'
                variant='standard'
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                error={!!formErrors.description}
                value={bookInfo.description}
                helperText={
                  formErrors.description ? formErrors.description : ''
                }
                label='description of book'
                name='description'
                variant='standard'
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <br />

          <Button
            variant='contained'
            sx={{ display: 'block', margin: 'auto', mt: 2 }}
            onClick={handleSubmit}
          >
            Add book
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
