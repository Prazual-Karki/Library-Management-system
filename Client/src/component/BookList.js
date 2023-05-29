import React from 'react'
import { Grid, Typography, TextField } from '@mui/material'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import Book from './Book'
import { Box } from '@mui/material'
import { BASE_URL } from './helper'

const BookList = () => {
  const [book, setbook] = useState([])
  var cancelToken

  useEffect(() => {
    fetchData()

    return () => {
      if (cancelToken) {
        cancelToken('Cleanup function called before request completion.')
      }
    }
  }, [])
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllBooks`, {
        cancelToken: new axios.CancelToken((token) => (cancelToken = token)),
      })
      setbook(response.data)
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('fetch cancelled for cleanup of product.js')
      }
    }
  }
  const handleSearch = async (e) => {
    let key = e.target.value
    if (key) {
      const searchBooks = await axios.get(`${BASE_URL}/searchbooks/${key}`)
      if (searchBooks) {
        setbook(searchBooks.data)
      }
    } else {
      fetchData()
    }
  }

  return (
    <>
      {book.length > 0 ? (
        <>
          <Box
            py={2}
            my={1}
            mb='1%'
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              backgroundColor: 'white',
              boxShadow: '0px 1px 3px 0 rgba(0,0,0,0.2)',
            }}
          >
            <Typography variant='button' fontSize={22}>
              popular Book of the library
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                id='input-with-sx'
                label='search book..'
                type='search'
                variant='standard'
                sx={{ textAlign: 'center' }}
                onChange={handleSearch}
              />
            </Box>
          </Box>

          <Grid container spacing={2} rowSpacing={3}>
            {book.map((item) => {
              return <Book key={item._id} data={item} />
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
          Oops! no book found...
        </Typography>
      )}
    </>
  )
}

export default BookList
