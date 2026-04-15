import React from 'react'
import Hero from '../components/Hero.jsx'
import FeaturedSection from '../components/FeaturedSection.jsx'
import Banner from '../components/Banner.jsx'
import Review from '../components/Review.jsx'
import Subscription from '../components/Subscription.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedSection/>
      <Banner/>
      <Review/>
      <Subscription/>

    </>
  )
}

export default Home
