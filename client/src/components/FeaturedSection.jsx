import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Cards from './Cards'
/* eslint-disable no-unused-vars */


const FeaturedSection = () => {
    const navigate = useNavigate();
    const { cars } = useAppContext();

  return (
    <div className='flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32'>

        <div>
            <Title title="Featured Cars" subTitle="Explore our selection of premium vehicles, ready to elevate your driving experience."/>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-16'>
            {
                cars.slice(0,6).map((car)=>(
                    <div key={car._id}>
                        <Cards car={car}/>
                    </div>
            ))
            }

        </div>

        <button className='flex items-center justify-center gap-2 px-6 border border-borderColor hover:bg-gray-50 rounded-md mt-16 cursor-pointer outline-none hover:text-primary-dull' onClick={()=> {navigate('/cars'); window.scrollTo(0,0)}}>
            Exlpore all Cars
            <img src={assets.arrow_icon} alt="arrow" />
        </button>
      
    </div>
  )
}

export default FeaturedSection
