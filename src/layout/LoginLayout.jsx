import React from 'react'
import Header from '../components/Header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/footer'

const LoginLayout = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main style={{ background: "var(--background-main)", color: "var(--text-primary)", minHeight: "calc(100vh - 160px)" }}>
        <Outlet />
      </main>

      <Footer isDarkMode={isDarkMode} />
    </>
  )
}

export default LoginLayout
