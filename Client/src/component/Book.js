import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'
import { Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import noPhoto from '../assets/noPhoto.jpg'
import { BASE_URL } from './helper'

export default function Book(props) {
  var photoName = props.data.photo.replace('public\\', '')
  photoName = `${BASE_URL}/${photoName}`

  return (
    <Grid item xs={6} sm={6} md={4}>
      <Card>
        <CardActionArea>
          <img
            src={photoName ? photoName : noPhoto}
            height='250'
            width='100%'
            alt='book'
          />

          <CardContent component='div' sx={{ pb: '2%', pl: '5%' }}>
            <Typography
              variant='body1'
              component='div'
              sx={{ fontSize: 17 }}
              gutterBottom
            >
              {props.data.bookName.toUpperCase()}
            </Typography>
            <Typography variant='button' component='div'>
              Author : {props.data.author}
            </Typography>
            <Typography variant='body2'>Genre: {props.data.genre}</Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Link
            to={`/bookInfo/${props.data._id}`}
            style={{ textDecoration: 'none', marginLeft: '3%' }}
          >
            <Button size='small' color='primary'>
              See more
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  )
}
