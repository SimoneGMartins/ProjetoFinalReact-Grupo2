import React from 'react'
import Header from '../components/Header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/footer'

const LoginLayout = () => {
  return (
        <>
            <Header />
            <main>
                <Outlet/>
            </main>
            <Footer />
        </>
  )
}

export default LoginLayout