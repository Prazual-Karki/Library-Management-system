import React from 'react'
import { Grid, Typography, TextField } from '@mui/material'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import Book from './Book'
import { useParams } from 'react-router'
import { BASE_URL } from './helper'

const RecommendSection = () => {
  const params = useParams()
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
      const response = await axios.get(
        `${BASE_URL}/getRecommendedbooks/${params.id}`,
        {
          cancelToken: new axios.CancelToken((token) => (cancelToken = token)),
        }
      )
      setbook(response.data)
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('fetch cancelled for cleanup of product.js')
      }
    }
  }

  return (
    <>
      {Array.isArray(book) ? (
        <>
          <Typography variant='h3' textAlign='center'>
            Recommended for you
          </Typography>
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
          Oops! no recommendation for you...
        </Typography>
      )}
    </>
  )
}

export default RecommendSection
