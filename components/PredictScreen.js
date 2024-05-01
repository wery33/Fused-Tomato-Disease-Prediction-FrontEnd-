import React, { useState } from "react";
import Loader from "./Loader";
import Modal from "./Modal";

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
    if (!base64Image) {
      setModalData({
        title: "Error",
        message: "Please select an image before predicting.",
        isSuccess: false,
        isOpen: true,
      });
      return;
    }
  
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
        }, 1000);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
<>
<div className="bg-cover bg-center bg-opacity-70" style={{backgroundImage: 'url("tomatogood.jpg")'}}>
<div className="bg-black bg-opacity-70">
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
              <img
                height={300}
                width={320}
                src={imageDataUrl}
                alt="Image 1"
                className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
              />
            ) : (
              <img
                height={250}
                width={250}
                src={"noImage.jpg"}
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
            <div className="bg-green-700 p-4 rounded-md">
              <p className="text-lg text-white mb-4 font-bold">Predicted Class</p>
              <p className="text-xl text-white mb-4">{classname}</p>
              <p className="text-5xl font-extrabold text-white">{confidence} %</p>
            </div>
          </div>
        ) : (
          <div className="text-left p-4">
            <p className="text-base bg-gray-200 p-4">
            Tomato diseases represent a significant threat to global food security, necessitating innovative solutions for early detection and management. Deep learning, particularly CNNs, offers a promising approach for predicting and diagnosing tomato diseases from images, providing farmers with timely and accurate information to mitigate crop losses and optimize agricultural practices. By harnessing the power of artificial intelligence and image analysis, we can enhance disease management strategies, improve crop resilience, and ensure sustainable tomato production for future generations.
            </p>
          </div>
        )}
      </div>

      
      {predictions.length > 0 ? (
        <div className="rounded-lg ">
        <div className="flow-root p-12">
          <dl className="-my-3 divide-y divide-gray-100 text-base">
            <div className=" p-2 grid grid-cols-1 gap-16 py-3 bg-gray-50 sm:grid-cols-3 sm:gap-10">
              <dt className="font-bold text-lg text-gray-900">Diseases</dt>
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
        <p className="text-justify">This model represents a state-of-the-art convolutional neural network (CNN) architecture meticulously crafted using the powerful Keras TensorFlow framework, tailored specifically for predicting Tomato diseases from fused images. Its sophisticated design and comprehensive preprocessing steps ensure optimal performance in disease diagnosis from agricultural images. Leveraging sequential layers including convolutional, max-pooling, and dense layers, this model excels in feature extraction and intricate pattern recognition within the fused images. Its ability to preprocess input images, including resizing, rescaling, and data augmentation, enhances its adaptability to diverse agricultural image datasets. By finely tuning parameters such as filter sizes and activation functions, this CNN architecture captures nuanced details within fused images, enabling accurate disease identification in Tomato crops.</p>

          <p className="text-lg font-semibold text-center mt-3 mb-2">Performance of Model</p>
          <p className="text-justify">During rigorous evaluation, this model achieved exceptional accuracy, reaching an impressive 99%, showcasing its robustness and reliability in predicting Tomato diseases from fused images. Moreover, it demonstrated unparalleled confidence levels, accurately predicting most diseases with confidence exceeding 98%, providing farmers with precise disease identification. The model's evaluation metrics further underscore its efficacy, boasting high precision (91%), recall (89%), and F-1 score (90%), crucial indicators of its ability to correctly identify diseased Tomato crops while minimizing false positives. With its remarkable performance and meticulous evaluation metrics, this CNN architecture stands as a beacon of innovation in agricultural image analysis, poised to revolutionize disease management strategies and enhance crop yield..</p>
          
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
