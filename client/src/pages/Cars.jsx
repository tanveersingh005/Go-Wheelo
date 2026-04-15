/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Title from '../components/Title.jsx'
import { assets } from '../assets/assets.js'
import Cards from '../components/Cards.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Cars = () => {
  const { cars, axios } = useAppContext();
  const [searchParams] = useSearchParams();
  
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const [availableCars, setAvailableCars] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [input, setInput] = useState('');

  // Fetch specific availability if query parameters exist
  React.useEffect(() => {
    const fetchAvailable = async () => {
      if (pickupLocation && pickupDate && returnDate && pickupLocation !== "undefined" && pickupDate !== "undefined") {
        setIsSearching(true);
        try {
          const { data } = await axios.post("/api/bookings/check-availability", {
            location: pickupLocation,
            pickupDate,
            returnDate
          });
          if (data.success) {
            setAvailableCars(data.availableCars);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      }
    };
    fetchAvailable();
  }, [pickupLocation, pickupDate, returnDate, axios]);

  // Determine base car array (either filtered by date/location or all global cars)
  const baseCars = (pickupLocation && pickupDate && returnDate && pickupLocation !== "undefined" && pickupDate !== "undefined") 
      ? availableCars 
      : cars;

  // Final text search filtering on the active baseline
  const filteredCars = baseCars.filter((car) =>
    `${car.brand} ${car.model} ${car.category} ${car.fuel_type}`
      .toLowerCase()
      .includes(input.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-500 pb-20">

      {/* Header */}
    <div className='flex flex-col items-center py-20 bg-zinc-50 dark:bg-zinc-900 border-b border-light-border dark:border-dark-border max-md:px-4'>
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        {/* Search Bar */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className='flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-5 mt-10 max-w-2xl w-full h-14 rounded-full shadow-lg transition-all focus-within:ring-2 focus-within:ring-blue-500/30'
        >
          <img src={assets.search_icon} className='w-5 h-5 mr-3 opacity-60 dark:invert' alt="search" />

          <input
            type="text"
            className="w-full h-full bg-transparent outline-none text-zinc-900 dark:text-zinc-100 font-medium placeholder-zinc-400"
            placeholder="Search by model, brand, or fuel"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <img src={assets.filter_icon} className='w-5 h-5 ml-3 opacity-60 dark:invert cursor-pointer hover:opacity-100 transition' alt="filter" />
        </motion.div>
      </div>

      {/* Cars Section */}
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-12'>
        <div className="flex justify-between items-end mb-8 xl:px-20 max-w-7xl mx-auto">
           <p className='text-zinc-500 dark:text-zinc-400 font-medium'>
             Showing {filteredCars.length} vehicles
           </p>
        </div>

        <motion.div layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:px-20 max-w-7xl mx-auto'>
          <AnimatePresence>
          {
            isSearching ? (
              <p className="text-zinc-500 dark:text-zinc-400 col-span-full text-center mt-10 text-lg font-medium">
                Checking absolute availability...
              </p>
            ) : filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <Cards key={car._id} car={car} />
              ))
            ) : (
              <p className="text-zinc-500 dark:text-zinc-400 col-span-full text-center mt-10 text-lg font-medium">
                No luxury vehicle found matching your criteria.
              </p>
            )
          }
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  )
}

export default Cars
