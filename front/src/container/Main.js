import React from 'react'
import Header from '../component/Header'

export default function Main({ children }) {
  return (
    <div className='x_main'>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}
