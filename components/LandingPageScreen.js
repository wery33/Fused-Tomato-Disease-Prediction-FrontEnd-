import React, { useState } from 'react';
import Link from 'next/link';

const LandingPage = () => {
  const [showVideo, setShowVideo] = useState(false);

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <section className="bg-cover bg-center bg-opacity-70" style={{backgroundImage: 'url("bg-image.jpg")'}}>
      <div className="bg-black bg-opacity-70">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
              Fused Tomato Disease 
              <strong className="font-extrabold text-white sm:block"> Prediction</strong>
            </h1>
            <p className="mt-4 sm:text-xl/relaxed text-justify text-white">
              Welcome to our cutting-edge Tomato Disease Detection Web Application powered by 
              state-of-the-art AI and Machine Learning technologies. Tomatoes, pivotal to global agriculture, 
              require precise care. Leveraging the power of Deep Learning, along with Data Splitting and Fusion techniques,
              we ensure accurate disease diagnosis and management. Join us at the forefront of agricultural innovation, 
              revolutionizing crop health and yield optimization for a sustainable future. Select an option below to embark 
              on this exciting journey of advancement.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none 
                focus:ring active:bg-red-500 sm:w-auto"
                href="/fusion"
              >
                Image fusion
              </Link>

              <Link
                className=" bg-white block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none 
                focus:ring active:text-red-500 sm:w-auto"
                href="/predict"
              >
                Prediction
              </Link>
              
              <button
                className="block w-full rounded bg-gray-800 px-12 py-3 text-sm font-medium text-white shadow hover:bg-gray-900 focus:outline-none 
                focus:ring active:bg-gray-700 sm:w-auto"
                onClick={toggleVideo}
              >
                Watch Video
              </button>
            </div>

            {showVideo && (
              <div className="mt-8">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/ibQn0XFgYrY"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
