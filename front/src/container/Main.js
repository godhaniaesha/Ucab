import React from 'react'
import Header from '../component/Header'

export default function Main({ children }) {
  return (
    <div>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}
