import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import noPhoto from '../assets/noPhoto.jpg'

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from './helper'

export default function UpdateBook() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = JSON.parse(localStorage.getItem('users'))._id
  const [bookInfo, setbookInfo] = useState({
    bookName: '',
    author: '',
    genre: '',
    photo: '',
  })
  const [uploadedFile, setuploadedFile] = useState(null)
  const [profilePic, setprofilePic] = useState(null)
  const [isupdate, setisupdate] = useState(false)

  const [formErrors, setformErrors] = useState({})

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    axios
      .get(
        `${BASE_URL}/getBookDetailById/${params.id}`,
        {
          headers: {
            authorization: `bearer ${localStorage.getItem('token')}`,
          },
        },
        {
          cancelToken: cancelToken.token,
        }
      )
      .then((res) => {
        setbookInfo(res.data)

        if (res.data.photo) {
          var photoName = res.data.photo.replace('public/', '')
          photoName = `${BASE_URL}/${photoName}`
          setprofilePic(photoName)
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetch cancelled for cleanup of updateProduct.js')
        }
      })

    return () => {
      cancelToken.cancel()
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setbookInfo({
      ...bookInfo,
      [name]: value,
    })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setformErrors(validateForm(bookInfo))
    setisupdate(true)
    if (Object.keys(formErrors).length === 0 && isupdate) {
      try {
        const imageFile = uploadedFile ? uploadedFile : bookInfo.photo
        const formData = new FormData()
        formData.append('bookName', bookInfo.bookName)
        formData.append('author', bookInfo.author)
        formData.append('genre', bookInfo.genre)

        formData.append('photo', imageFile)

        const response = await axios.put(
          `${BASE_URL}/updateBookById/` + params.id,
          formData,
          {
            headers: {
              authorization: `bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (response.status === 200) {
          navigate('/dashboard')
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
    if (values.author.length < 1) {
      errors.author = '*required'
    }

    if (values.bookName.length < 1) {
      errors.bookName = '*required'
    }
    if (values.genre.length < 1) {
      errors.genre = '*required'
    }

    return errors
  }
  return (
    <Box
      component='form'
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },

        backgroundColor: '#f0ebec',
        padding: '2% 1%',
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
        Update Book information
      </Typography>
      <hr />
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <img
            src={profilePic ? profilePic : noPhoto}
            alt='pic'
            height='300px'
            width='400px'
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                error={!!formErrors.bookName}
                value={bookInfo.bookName}
                helperText={formErrors.bookName ? formErrors.bookName : ''}
                label='Name of Book'
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
                label='Book author'
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
                label=' genre '
                name='genre'
                variant='standard'
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <br />
          <div>
            <Button component='label' startIcon={<AddAPhotoIcon />}>
              <input
                hidden
                accept='image/*'
                type='file'
                onChange={(e) => {
                  setuploadedFile(e.target.files[0])
                  setprofilePic(URL.createObjectURL(e.target.files[0]))
                }}
              />
              change Book photo
            </Button>
          </div>

          <Button
            variant='contained'
            color='error'
            sx={{ display: 'block', margin: 'auto', mt: 2 }}
            onClick={handleSubmit}
          >
            Update book info
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
