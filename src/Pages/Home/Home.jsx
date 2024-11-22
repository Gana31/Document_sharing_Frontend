import React from 'react'
import Hero from './Hero'
import OurPolicy from './Policy'
import NewsLetterBox from '../../Component/NewsletterBox'
import NewProducts from './NewProducts'

function Home() {
  return (
    <>
    <Hero/>
    <NewProducts/>
    <OurPolicy/>
    <NewsLetterBox/>
    </>
  )
}

export default Home