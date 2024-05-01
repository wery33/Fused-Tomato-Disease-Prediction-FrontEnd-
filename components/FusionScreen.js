import { useState } from "react";
import Loader from "./Loader";
import Modal from "./Modal";
import Link from "next/link";

function FusionPage() {
  const [image1DataUrl, setImage1DataUrl] = useState(null);
  const [image2DataUrl, setImage2DataUrl] = useState(null);
  const [fusedImage1To2DataUrl, setFusedImage1To2DataUrl] = useState(null);
  const [fusedImage2To1DataUrl, setFusedImage2To1DataUrl] = useState(null);
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

  const handledownloadImage1 = async () => {
    fetch(`http://localhost:5000/download-fused-image/fused_image_1_to_2.jpg`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `fusedImage1.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("There was an error downloading the image:", error);
      });
  };

  const handledownloadImage2 = async () => {
    fetch(`http://localhost:5000/download-fused-image/fused_image_2_to_1.jpg`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `fusedImage2.jpg`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("There was an error downloading the image:", error);
      });
  };

  const handleImage1Change = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage1DataUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImage2Change = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage2DataUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFusion = async () => {
    setIsLoading(true);

    try {
      if (!image1DataUrl || !image2DataUrl) {
        setIsLoading(false);
        setModalData({
          title: "Error",
          message: "No Images Selected.Kindly Choose an Image",
          isSuccess: false,
          isOpen: true,
        });
      }

      const formData = new FormData();
      formData.append("image1", dataURLtoFile(image1DataUrl, "image1.jpg"));
      formData.append("image2", dataURLtoFile(image2DataUrl, "image2.jpg"));

      const response = await fetch("http://127.0.0.1:5000/image-fusion", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setIsLoading(false);
        setModalData({
          title: "Error",
          message: "No Images Selected.Kindly Choose an Image",
          isSuccess: false,
          isOpen: true,
        });
      }

      const data = await response.json();
      console.log(data);

      setTimeout(() => {
        setFusedImage1To2DataUrl(
          `http://localhost:5000/get-fused-image/${
            data.fused_image_1_to_2_path
          }?${new Date().getTime()}`
        );
        setFusedImage2To1DataUrl(
          `http://localhost:5000/get-fused-image/${
            data.fused_image_2_to_1_path
          }?${new Date().getTime()}`
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error.message);
      setModalData({
        title: "Error",
        message: "No Images Selected.Kindly Choose an Image",
        isSuccess: false,
        isOpen: true,
      });
    }
  };

  // Convert data URL to file
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      <div
        className="bg-cover bg-center bg-opacity-70"
        style={{ backgroundImage: 'url("qc.webp")' }}
      >
        <div className="bg-black bg-opacity-80">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mb-12">
            <div className="rounded-lg bg-white-200">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-center mt-6 text-white">
                      Select Tomato Leaf 1
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
                          onChange={handleImage1Change}
                          className="hidden"
                          name="image1"
                        />
                      </label>
                    </div>
                    {image1DataUrl ? (
                      <img
                        height={250}
                        width={250}
                        src={image1DataUrl}
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
                  </div>
                </div>

                <div>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-center mt-6 text-white">
                      Select Tomato Leaf 2
                    </h2>
                    <p className="text-center font-medium text-red-600 mb-2">
                      Accepted type: .jpg, .png
                    </p>
                    <div>
                      <label className="mb-2 text-center block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto">
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImage2Change}
                          className="hidden"
                          name="image1"
                        />
                      </label>
                    </div>

                    {image2DataUrl ? (
                      <img
                        height={250}
                        width={250}
                        src={image2DataUrl}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    ) : (
                      <img
                        height={250}
                        width={250}
                        src={"noImage.jpg"}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="items-center flex justify-center">
                <div className="rounded-lg bg-gray-200 h-12">
                  <button
                    className="block w-full text-center rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                    onClick={handleFusion}
                  >
                    Fuse Images
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg ">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                <div>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-center mt-6 text-white">
                      Fused Tomato Disease Leaf
                    </h2>
                    <p className="text-center font-medium text-red-600 mb-2">
                      Fused Image Type: .jpg
                    </p>
                    {fusedImage1To2DataUrl ? (
                      <img
                        height={250}
                        width={250}
                        src={fusedImage1To2DataUrl}
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
                        className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                        onClick={handledownloadImage1}
                      >
                        Download Image
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-center mt-6 text-white">
                      Fused Tomato Disease Leaf
                    </h2>
                    <p className="text-center font-medium text-red-600 mb-2">
                      Fused Image Type: .jpg
                    </p>
                    {fusedImage2To1DataUrl ? (
                      <img
                        height={250}
                        width={250}
                        src={fusedImage2To1DataUrl}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    ) : (
                      <img
                        height={250}
                        width={250}
                        src={"noImage.jpg"}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    )}
                    <div className="p-2">
                      <button
                        className="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                        onClick={handledownloadImage2}
                      >
                        Download Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className=" p-4 text-justify">
              {fusedImage2To1DataUrl ? (
                <>
                  <p className="text-base bg-green-900 p-4 text-center rounded-md">
                    <p className="text-3xl text-white font-bold  ">
                      {" "}
                      Image Fusion Done{" "}
                    </p>
                    <p className="text-base bg-gray-200 p-10">
                      Image splitting and fusion has been successfully
                      completed. Download and proceeed to Prediction
                    </p>
                    <div className="flex justify-center mt-3">
                      <Link
                        href="/predict"
                        className="block w-full text-center rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                      >
                        Predict Now
                      </Link>
                    </div>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-center mb-2 text-white">
                    About Image Fusion
                  </p>
                  <p className="text-base bg-gray-200 p-10">
                    Data Fusion represents a groundbreaking paradigm in data
                    analysis, facilitating the integration of disparate datasets
                    to yield comprehensive insights and facilitate informed
                    decision-making. Its application extends far beyond
                    traditional boundaries, offering a multifaceted approach to
                    understanding complex phenomena across various domains. In
                    agricultural research, particularly in the context of Tomato
                    Disease studies, the need for Data Fusion is pronounced.
                    Tomatoes, being a cornerstone of global agriculture, are
                    susceptible to various diseases that can devastate yields if
                    not properly managed. Given the intricate interplay of
                    environmental factors, plant physiology, and disease
                    pathology, a holistic understanding is imperative for
                    effective disease management strategies. By leveraging Data
                    Fusion techniques, researchers can integrate diverse
                    datasets encompassing environmental conditions, plant health
                    indicators, and disease prevalence data. This comprehensive
                    approach enables a deeper understanding of the complex
                    interactions between various factors influencing disease
                    development and spread. For instance, by combining satellite
                    imagery to assess environmental conditions, sensor data to
                    monitor plant health parameters, and historical disease
                    incidence records, researchers can identify patterns and
                    correlations that may be obscured when analyzing individual
                    datasets in isolation. Moreover, Data Fusion enhances the
                    accuracy and reliability of disease detection and diagnosis.
                    By synthesizing information from multiple sources, including
                    visual symptoms observed in plant images, molecular markers,
                    and environmental variables, researchers can develop robust
                    disease classification models with higher precision and
                    recall rates. This not only aids in early detection and
                    timely intervention but also minimizes misdiagnosis and
                    false positives, thereby optimizing disease management
                    strategies and mitigating crop losses. Furthermore, Data
                    Fusion fosters collaboration and knowledge sharing among
                    researchers, agronomists, and other stakeholders involved in
                    tomato disease research. By integrating insights from
                    diverse disciplines such as agronomy, plant pathology, and
                    data science, interdisciplinary teams can leverage their
                    collective expertise to tackle complex challenges more
                    effectively. This collaborative approach not only
                    accelerates the pace of scientific discovery but also
                    facilitates the translation of research findings into
                    practical solutions that benefit farmers and agricultural
                    communities. In summary, Data Fusion plays a pivotal role in
                    advancing research on tomato diseases by enabling a holistic
                    understanding of the complex interactions between
                    environmental factors, plant health, and disease dynamics.
                    By integrating diverse datasets and fostering
                    interdisciplinary collaboration, Data Fusion enhances the
                    accuracy, reliability, and effectiveness of disease
                    management strategies, ultimately contributing to the
                    sustainability and resilience of agricultural systems.
                  </p>
                </>
              )}
            </div>
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

export default FusionPage;
