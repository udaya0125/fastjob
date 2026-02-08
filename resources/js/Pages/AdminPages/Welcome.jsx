import React from "react";


const Welcome = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#073b4c] to-[#ffd166]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 items-center min-h-screen md:py-24 py-10">
          
          {/* Text Content */}
          <div className="order-2 md:order-1 mt-6">
            <h1 className="text-white text-4xl md:text-5xl font-bold">
              Fast Job Solution
            </h1>

            <p className="text-white mt-6 mb-8 text-lg leading-relaxed">
              Fast Job Solution is a premier job recruitment agency dedicated to
              bridging the gap between employers and job seekers. We specialize
              in connecting businesses with top talent and helping individuals
              find the perfect job opportunities tailored to their skills and
              aspirations.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-8 py-4 bg-[#ffd166] text-gray-800 font-semibold rounded-md hover:bg-yellow-400 transition"
              >
                Contact Us
              </a>

              <a
                href="/login"
                className="px-8 py-4 bg-white text-[#283618] font-semibold rounded-md hover:bg-gray-100 transition"
              >
                Login
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 mt-6 flex justify-center">
            <img
              src="/images/4565.jpg"
              alt="Fast Job Solution"
              className="w-full mix-blend-color-burn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
