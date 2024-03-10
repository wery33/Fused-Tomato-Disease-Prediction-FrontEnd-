import { useState } from "react";
import Loader from "./Loader";
import Modal from "./Modal";
import Link from "next/link";
import Image from "next/image";

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
      }, 15000);
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
        style={{ backgroundImage: 'url("bg-image.jpg")' }}
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
                      <Image
                        height={250}
                        width={250}
                        src={image1DataUrl}
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
                      <Image
                        height={250}
                        width={250}
                        src={image2DataUrl}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    ) : (
                      <Image
                        height={250}
                        width={250}
                        src={"/assets/noImage.jpg"}
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
                      <Image
                        height={250}
                        width={250}
                        src={fusedImage1To2DataUrl}
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
                      <Image
                        height={250}
                        width={250}
                        src={fusedImage2To1DataUrl}
                        alt="Image 2"
                        className="mt-2 mb-4 border-2 border-gray-300 rounded-md"
                      />
                    ) : (
                      <Image
                        height={250}
                        width={250}
                        src={"/assets/noImage.jpg"}
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
                  <p className="text-base bg-green-700 p-10 text-center">
                    <p className="text-3xl text-white font-bold">
                      {" "}
                      Image Fusion Done{" "}
                    </p>
                    <p className="text-base bg-gray-200 p-8 mt-4">
                      Our Images has been fused succesfuly to prosuce two images
                      which containes the halfs of the two disease.Let see if
                      our model will be able to oredict the classes of the
                      disease in the images really well. That will the final
                      stgae of our project. Download the images and uplaod them
                      on the predict pgae to see our model in motion.
                      <div className="flex justify-center mt-3">
                        <Link
                          href="/predict"
                          className="block w-full text-center rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                        >
                          Predict Now
                        </Link>
                      </div>
                    </p>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-center mb-2 text-white">
                    About Image Fusion
                  </p>
                  <p className="text-base bg-gray-200 p-10">
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical Latin literature
                    from 45 BC, making it over 2000 years old. Richard
                    McClintock, a Latin professor at Hampden-Sydney College in
                    Virginia, looked up one of the more obscure Latin words,
                    consectetur, from a Lorem Ipsum passage, Contrary to popular
                    belief, Lorem Ipsum is not simply random text. It has roots
                    in a piece of classical Latin literature from 45 BC, making
                    it over 2000 years old. Richard McClintock, a Latin
                    professor at Hampden-Sydney College in Virginia, looked up
                    one of the more obscure Latin words, consectetur, from a
                    Lorem Ipsum passage, Contrary to popular belief, Lorem Ipsum
                    is not simply random text. It has roots in a piece of
                    classical Latin literature from 45 BC, making it over 2000
                    years old. Richard McClintock, a Latin professor at
                    Hampden-Sydney College in Virginia, looked up one of the
                    more obscure Latin words, consectetur, from a Lorem Ipsum
                    passage, a Latin professor at Hampden-Sydney College in
                    Virginia, looked up one of the more obscure Latin words,
                    consectetur, from a Lorem Ipsum passage,
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
