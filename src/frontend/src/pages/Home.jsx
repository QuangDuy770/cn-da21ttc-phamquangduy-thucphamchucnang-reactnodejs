import React from 'react'
import Hero from '../components/Hero'
import LatestProduct from '../components/LatestProduct'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestProduct/>
      <BestSeller/>
      <OurPolicy/>
    </div>
  )
}

export default Home
