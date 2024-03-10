import React, { useState } from "react";
import Loader from "./Loader";
import Modal from "./Modal";
import Image from "next/image";

function PredictPage() {
  const [base64Image, setBase64Image] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [classname, setMaxClassName] = useState("");
  const [confidence, setMaxConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    isOpen: false,
    isSuccess: false,
  });
  const closeModal = () => {
    setModalData({ title: "", message: "", isOpen: false, isSuccess: false });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const dataURL = event.target.result;
      setImageDataUrl(dataURL);
      setBase64Image(dataURL.split(",")[1]);
    };

    reader.readAsDataURL(file);
  };

  const handlePredictClick = () => {
    setIsLoading(true);
  
    const message = {
      image: base64Image,
    };

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
        setPredictions(data['predictions']);
        setMaxClassName(data['max_confidence']['class_name']);
        setMaxConfidence(data['max_confidence']['confidence']);
        setIsLoading(false);
      }, 15000);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
<>
<div className="bg-cover bg-center bg-opacity-70" style={{backgroundImage: 'url("bg-image.jpg")'}}>
<div className="bg-black bg-opacity-80">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
      <div className="rounded-lg">
        <div>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-center mt-6 text-white">
              Select Tomato Leaf 
            </h2>
            <p className="font-medium text-red-600 mb-2">
              Accepted type: .jpg, .png
            </p>
            <div>
              <label className="text-center mb-2 block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  name="image1"
                />
              </label>
            </div>
            {imageDataUrl ? (
              <Image
                height={250}
                width={250}
                src={imageDataUrl}
                alt="Image 1"
                className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
              />
            ) : (
              <Image
                height={250}
                width={250}
                src={"/assets/noImage.jpg"}
                alt="Image 1"
                className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
              />
            )}
            <div className="p-2">
              <button
                onClick={handlePredictClick}
                className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
              >
                Predict Disease
              </button>
            </div>
          </div>
        </div>

        {predictions.length > 0 ? (
          <div class="rounded-lg text-center p-4 ">
            <div className="bg-green-800 p-4 rounded-md">
              <p className="text-lg text-white mb-4 font-bold">Predicted Class</p>
              <p className="text-xl text-white mb-4">{classname}</p>
              <p className="text-5xl font-extrabold text-white">{confidence} %</p>
            </div>
          </div>
        ) : (
          <div className="text-left p-4">
            <p className="text-base bg-gray-200 p-4">
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage,
            </p>
          </div>
        )}
      </div>

      
      {predictions.length > 0 ? (
        <div className="rounded-lg ">
        <div className="flow-root p-12">
          <dl className="-my-3 divide-y divide-gray-100 text-base">
            <div className=" p-2 grid grid-cols-1 gap-16 py-3 bg-gray-50 sm:grid-cols-3 sm:gap-10">
              <dt className="font-bold text-lg text-gray-900">Classes</dt>
              <dt className="font-bold text-lg text-gray-900 px-80">Confidence</dt>
            </div>
            {predictions.map((prediction, index) => (
              <div key={index} 
              className=" bg-gray-200 p-2 grid grid-cols-1 gap-20 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">{prediction.class_name}</dt>
                <dd className="sm:col-span-2 px-96 font-bold text-red-700">{prediction.confidence.toFixed(2)}%</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
        ) : (
          <div className="flow-root p-12">
          <p className="text-lg font-semibold text-center mb-5 text-white">Model Prediction</p>
          <div className="text-base text-left bg-gray-200 p-4">
          <p className="text-lg font-semibold text-center mb-2">About Model</p>
          <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there is not anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>

          <p className="text-lg font-semibold text-center mt-3 mb-2">About Another Thing</p>
          <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which do not look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there is not anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
          
          </div>
        </div>
        )}


    </div>
    </div>
    </div>
    {isLoading && <Loader />}
      {modalData.isOpen && (
        <Modal
          title={modalData.title}
          message={modalData.message}
          onClose={closeModal}
          isSuccess={modalData.isSuccess}
        />
      )}
    </>
  );
}

export default PredictPage;
