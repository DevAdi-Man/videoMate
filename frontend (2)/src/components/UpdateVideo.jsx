import React, { useState } from "react";
import Input from "./Inputs";
import Button from "./Button";
import videoService from "../services/VideoService";
import { useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import {useNavigate} from "react-router-dom"
const UpdateVideo = (video) => {
 
  const [hide, setHide] = useState();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate()

  const upload = async (data) => {
    try {
      const newData = {
        thumbnail: data.thumb[0],
        title: data?.title,
        description: data.des,
      };


      const res = await videoService.updateVideo(newData, video.id);
      if(res){
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <MdEdit
        onClick={() => setHide(true)}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        type="button"
      />

      {/* <!-- Main modal --> */}
      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          hide ? "" : "hidden"
        } flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* <!-- Modal header --> */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                update video
              </h3>
              <button
                onClick={() => setHide(false)}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
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
            {/* <!-- Modal body --> */}
            <div className="p-4">
              <form onSubmit={handleSubmit(upload)}>
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

                <Button type="submit" className="mt-4">
                  save
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateVideo;
