import React, { useEffect, useState } from "react";
import Input from "./Inputs";
import Button from "./Button";
import { useForm } from "react-hook-form";
import useVideoMutation from "../hooks/react-query/mutation/video/videoMutetion";

const Modal = () => {
  const [hide, setHide] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const videoMutation = useVideoMutation();

  const upload = async (data) => {
    const formData = {
      videoFile: data.video[0],
      thumbnail: data.thumb[0],
      title: data.title,
      description: data.des,
    };
    videoMutation.mutate(formData);
  };

  // Auto-close modal and reset form on success
  useEffect(() => {
    if (videoMutation.isSuccess) {
      setHide(false);
      reset();
    }
  }, [videoMutation.isSuccess]);

  return (
    <>
      {/* Modal toggle */}
      <button
        onClick={() => setHide(true)}
        className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white"
        type="button"
      >
        Upload video
      </button>

      {/* Modal */}
      <div
        id="authentication-modal"
        className={`${
          hide ? "" : "hidden"
        } flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload Video
              </h3>
              <button
                onClick={() => setHide(false)}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <form onSubmit={handleSubmit(upload)}>
                <Input
                  lable="Video File"
                  type="file"
                  {...register("video", { required: true })}
                />
                <Input
                  lable="Thumbnail"
                  type="file"
                  {...register("thumb", { required: true })}
                />
                <Input
                  lable="Title"
                  type="text"
                  {...register("title", { required: true })}
                />
                <Input
                  lable="Description"
                  type="text"
                  height="48"
                  {...register("des", { required: true })}
                />

                <Button type="submit" disabled={videoMutation.isPending} className="mt-4 w-full">
                  {videoMutation.isPending ? "Uploading..." : "Save"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
