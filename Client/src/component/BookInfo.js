import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Button, Typography } from '@mui/material'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import noPhoto from '../assets/noPhoto.jpg'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import MuiAlert from '@mui/material/Alert'
import RecommendSection from './RecommendSection'
import { BASE_URL } from './helper'

export default function BookInfo() {
  const [userId, setuserId] = useState('')

  const [open, setOpen] = React.useState(false)

  const params = useParams()
  const [bookInfo, setbookInfo] = useState({
    bookName: '',
    author: '',
    genre: '',
    photo: '',
    description: '',
  })
  const [bookPhoto, setbookPhoto] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('users')

    if (user) {
      setuserId(JSON.parse(user)._id)
    }
    const cancelToken = axios.CancelToken.source()

    axios
      .get(
        `${BASE_URL}/getBookDetailById/${params.id}`,

        {
          cancelToken: cancelToken.token,
        }
      )
      .then((res) => {
        setbookInfo(res.data)

        if (res.data.photo) {
          var photoName = res.data.photo.replace('public/', '')
          photoName = `${BASE_URL}/${photoName}`
          setbookPhoto(photoName)
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetch cancelled for cleanup of profile.js')
        }
      })

    return () => {
      cancelToken.cancel()
    }
  }, [])
  return (
    <Box sx={{ flexGrow: 1, p: 2, mt: 5, mx: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} pl={5} pr={3} mb={3}>
          <img
            height='270'
            width='80%'
            src={bookPhoto ? bookPhoto : noPhoto}
            alt='book info'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={1}
            sx={{
              pt: 3,
              pl: 5,
              pb: 3,
              pr: 5,
              ml: 1,
              mr: 2,
              borderRadius: '2px',
            }}
          >
            <Typography variant='h6' component='h6'>
              {bookInfo.bookName.toUpperCase()}
            </Typography>
            <br />
            <Typography variant='button' component='div'>
              Author : {bookInfo.author}
            </Typography>
            <br />
            <Typography variant='button' component='div'>
              Genre : {bookInfo.genre}
            </Typography>
            <br />
            <Typography variant='button' component='div'>
              Description : {bookInfo.description}
            </Typography>
            <br />
            <Box justifyContent='flex-start'>
              <Link
                to='/bookList'
                style={{
                  textDecoration: 'none',
                }}
              >
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<ArrowBackIosIcon />}
                >
                  Back
                </Button>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* recommendation for user */}
      {userId && <RecommendSection />}
    </Box>
  )
}
