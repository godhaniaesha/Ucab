import React from 'react'
import Header from '../component/Header'
import Footer from '../component/Footer'

export default function Main({ children }) {
  return (
    <div className='x_main'>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
