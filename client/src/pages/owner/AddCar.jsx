import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddCar = () => {
  const { axios, token } = useAppContext();
  const [image, setImage] = useState(null);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a car image");
      return;
    }
    
    for (const key in car) {
      if (car[key] === "") {
        toast.error("Please fill all the details");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.success) {
        toast.success(data.message);
        setCar({
          brand: "", model: "", year: "", pricePerDay: "", category: "",
          transmission: "", fuel_type: "", seating_capacity: "", location: "", description: ""
        });
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="px-6 py-10 mb-0 md:px-12 flex-1 relative bg-light-bg dark:bg-dark-bg z-0">
      <Title
        title="Add New Car"
        subTitle="Fill details to list your car for booking, including pricing, availability and car specifications."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-4xl glass-panel p-8 rounded-2xl "
      >
        {/* Upload */}
        <div className="flex items-center gap-6 mb-8 group">
          <label htmlFor="carImage" className="relative block">
            <div className="h-32 w-32 rounded-xl overflow-hidden border-2 border-dashed border-zinc-200 dark:border-zinc-700 group-hover:border-blue-500 transition-colors flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                className={image ? "h-full w-full object-cover" : "h-10 w-10 opacity-50 dark:invert"}
                alt="upload"
              />
            </div>
            <input
              type="file"
              id="carImage"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">Upload Vehicle Image</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">High quality pictures increase booking rates.</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Brand</label>
            <input
              name="brand"
              value={car.brand}
              placeholder="e.g. BMW"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Model</label>
            <input
              name="model"
              value={car.model}
              placeholder="e.g. M4"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Year</label>
            <input
              name="year"
              value={car.year}
              type="number"
              placeholder="2025"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Daily Price ($)</label>
            <input
              name="pricePerDay"
              value={car.pricePerDay}
              type="number"
              placeholder="100"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Category</label>
            <input
              name="category"
              value={car.category}
              placeholder="Sedan"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Transmission</label>
            <input
              name="transmission"
              value={car.transmission}
              placeholder="Automatic"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Fuel Type</label>
            <input
              name="fuel_type"
              value={car.fuel_type}
              placeholder="Diesel"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Seats</label>
            <input
              name="seating_capacity"
              value={car.seating_capacity}
              type="number"
              placeholder="5"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-3 mt-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Location</label>
            <input
              name="location"
              value={car.location}
              placeholder="e.g. San Francisco, CA"
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-3 mt-2">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Description</label>
            <textarea
              name="description"
              value={car.description}
              rows="4"
              placeholder="Describe your car, its condition, and any notable details..."
              className="w-full mt-2 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className=" flex mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl items-center justify-center gap-2 font-semibold w-full cursor-pointer shadow-lg shadow-blue-500/20 transition-all"
        >
          <img src={assets.tick_icon} alt="tick" className="filter brightness-0 invert" />
           Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
