import * as React from 'react'
import Box from '@mui/material/Box'
import { Button, Grid, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import UserBook from './UserBook'
import { BASE_URL } from './helper'

export default function Dashboard() {
  const params = useParams()
  // const auth = localStorage.getItem('users')
  const userId = JSON.parse(localStorage.getItem('users'))._id
  const [books, setbooks] = useState([])

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    axios
      .get(
        `${BASE_URL}/getBooksByUserId/${userId}`,
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
        setbooks(res.data)
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('fetch cancelled for cleanup of dashboard.js')
        }
      })

    return () => {
      cancelToken.cancel()
    }
  }, [books])
  return (
    <Box
      sx={{
        backgroundColor: '#f5f2f3',
        width: '100%',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2) ',
        margin: 'auto',
        marginBottom: '1%',
        px: '1%',
        py: '2%',
      }}
    >
      <Typography variant='h5'>DASHBOARD</Typography>
      <Typography variant='overline' component='div' fontSize={18}>
        welcome, {JSON.parse(localStorage.getItem('users')).username}
      </Typography>
      <Link to='/addBook' style={{ textDecoration: 'none' }}>
        <Button variant='contained'>upload new book</Button>
      </Link>

      <Box>
        {Array.isArray(books) ? (
          <>
            <Typography
              mb={2}
              mt={3}
              variant='button'
              component='h6'
              fontSize={22}
            >
              your uploaded books
            </Typography>
            <Grid container spacing={2} rowSpacing={3}>
              {books.map((item) => {
                return <UserBook key={item._id} data={item} />
              })}
            </Grid>
          </>
        ) : (
          <Typography
            mb={2}
            mt={3}
            variant='button'
            component='h6'
            fontSize={22}
            textAlign='center'
          >
            Oops! you haven't uploaded any books
          </Typography>
        )}
      </Box>
    </Box>
  )
}
