import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar'
import BookList from './component/BookList'
import Login from './component/Login'
import Register from './component/Register'
import AddBook from './component/AddBook'
import Dashboard from './component/Dashboard'
import HomePage from './component/HomePage'
import BookInfo from './component/BookInfo'
import UpdateBook from './component/UpdateBook'
import PrivateComponent from './component/PrivateComponent'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />

          <Route path='/bookList' element={<BookList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<PrivateComponent />}>
            <Route path='/addBook' element={<AddBook />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/updateBook/:id' element={<UpdateBook />} />
          </Route>

          <Route path='/bookInfo/:id' element={<BookInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
