import React from 'react'
import Header from '../components/Header/header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/footer'
import Sidebar from '../components/Sidebar/sidebar'

const MainLayout = () => {
  return (
    <div style={{display: 'flex'}}>
        <Sidebar />
        <div>
            <Header />
            <main>
                <Outlet/>
            </main>
            <Footer />
        </div>
    </div>
  )
}

export default MainLayout