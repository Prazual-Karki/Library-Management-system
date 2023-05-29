import React from 'react'
import libraryPhoto from '../assets/LibraryHomepage.png'
import noPhoto from '../assets/noPhoto.jpg'
import { Typography } from '@mui/material'

function HomePage() {
  return (
    <div>
      {/* <Typography variant='h5' textAlign='center' my={3}>
        Welcome to Aadi Info Library Home Page
      </Typography> */}
      <img
        src={libraryPhoto ? libraryPhoto : noPhoto}
        alt='bookPhoto'
        height='500px'
        width='100%'
      />
    </div>
  )
}

export default HomePage
