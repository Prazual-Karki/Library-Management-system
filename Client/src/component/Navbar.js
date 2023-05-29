import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { Link, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'

function Navbar() {
  const auth = localStorage.getItem('users')

  const [anchorElNav, setAnchorElNav] = React.useState(null)

  const navigate = useNavigate()

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  }
  const linkStyleM = {
    textDecoration: 'none',
    color: 'black',
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position='sticky' color='primary'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Link to='/' style={linkStyle}>
            <Typography
              variant='h6'
              noWrap
              sx={{
                mr: 8,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PK-Library
            </Typography>
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              marginLeft: '20px',
            }}
          >
            <IconButton
              size='large'
              aria-label=' nav-bars '
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* on mobile view */}
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to='/bookList' style={linkStyleM}>
                  <Typography textAlign='center'>Browse Books</Typography>
                </Link>
              </MenuItem>
              {auth && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to='/dashboard' style={linkStyleM}>
                    <Typography textAlign='center'>Dashboard</Typography>
                  </Link>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Link to='/' style={linkStyle}>
            <Typography
              variant='h5'
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Pk-Library
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* desktop view */}
            <Link to='/bookList' style={linkStyle}>
              <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                Browse Books
              </Button>
            </Link>
            {auth && (
              <Link to='/dashboard' style={linkStyle}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  Dashboard
                </Button>
              </Link>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {auth ? (
              <>
                <Link to='/login' style={linkStyle}>
                  <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                    onClick={() => {
                      localStorage.clear()
                      navigate('/login')
                    }}
                  >
                    Logout ({JSON.parse(auth).username.toUpperCase().charAt(0)})
                  </Button>
                </Link>
              </>
            ) : (
              <Link to='/login' style={linkStyle}>
                <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                  Login
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Navbar
