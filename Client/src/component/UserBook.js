import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Button, CardActionArea, CardActions } from '@mui/material'
import { Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import noPhoto from '../assets/noPhoto.jpg'
import axios from 'axios'
import { BASE_URL } from './helper'

export default function UserBook(props) {
  var photoName = props.data.photo.replace('public\\', '')
  photoName = `${BASE_URL}/${photoName}`

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/deleteSingleBook/${id}`, {
      headers: {
        authorization: `bearer ${localStorage.getItem('token')}`,
      },
    })
  }

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

          <CardContent component='div' sx={{ pb: '2%', ml: '3%' }}>
            <Typography variant='h6' fontSize='xxLarge' component='div'>
              {props.data.bookName.toUpperCase()}
            </Typography>
            <Typography variant='button' component='div'>
              Author : {props.data.author}
            </Typography>
            <Typography variant='body2'>
              Genre: Rs.{props.data.genre}
            </Typography>
            <Typography variant='body2'>
              Desciption: {props.data.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Link
            to={`/updateBook/${props.data._id}`}
            style={{ textDecoration: 'none', marginLeft: '5%' }}
          >
            <Button size='small' color='warning' variant='contained'>
              Update
            </Button>
          </Link>
          <Button
            size='small'
            color='error'
            variant='contained'
            sx={{ ml: '10%' }}
            onClick={() => {
              handleDelete(props.data._id)
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
