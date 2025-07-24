import React, { useEffect, useState } from "react";
import Input from "./Inputs";
import Button from "./Button";
import { useForm } from "react-hook-form";
import useVideoMutation from "../hooks/react-query/mutation/video/videoMutetion";
import { FiX, FiUpload, FiVideo, FiImage, FiType, FiFileText } from "react-icons/fi";

const Modal = () => {
  const [hide, setHide] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm();
  const videoMutation = useVideoMutation();
  
  const watchedVideo = watch("video");
  const watchedThumb = watch("thumb");

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
  }, [videoMutation.isSuccess, reset]);

  const closeModal = () => {
    setHide(false);
    reset();
  };

  return (
    <>
      {/* Modal toggle button */}
      <Button
        onClick={() => setHide(true)}
        variant="primary"
        size="md"
        className="flex items-center gap-2"
      >
        <FiUpload className="w-4 h-4" />
        Upload Video
      </Button>

      {/* Modal backdrop */}
      {hide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <FiVideo className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text">Upload Video</h3>
                    <p className="text-sm text-gray-400">Share your content with the world</p>
                  </div>
                </div>
                
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-gray-400 hover:text-text" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <form onSubmit={handleSubmit(upload)} className="space-y-6">
                  {/* File Upload Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Video File */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiVideo className="w-4 h-4" />
                        Video File
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="video/*"
                          {...register("video", { required: "Video file is required" })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg 
                                   text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                                   file:border-0 file:bg-primary file:text-white file:font-medium
                                   hover:file:bg-primary/80 focus:outline-none focus:ring-2 
                                   focus:ring-primary/50 transition-all duration-200"
                        />
                        {watchedVideo && watchedVideo[0] && (
                          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                            <FiVideo className="w-3 h-3" />
                            {watchedVideo[0].name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiImage className="w-4 h-4" />
                        Thumbnail
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          {...register("thumb", { required: "Thumbnail is required" })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg 
                                   text-text file:mr-4 file:py-2 file:px-4 file:rounded-lg 
                                   file:border-0 file:bg-accent file:text-white file:font-medium
                                   hover:file:bg-accent/80 focus:outline-none focus:ring-2 
                                   focus:ring-accent/50 transition-all duration-200"
                        />
                        {watchedThumb && watchedThumb[0] && (
                          <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                            <FiImage className="w-3 h-3" />
                            {watchedThumb[0].name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Text Inputs */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiType className="w-4 h-4" />
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter video title..."
                        {...register("title", { required: "Title is required" })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-text placeholder-gray-400 focus:outline-none focus:ring-2 
                                 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-text">
                        <FiFileText className="w-4 h-4" />
                        Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your video..."
                        {...register("des", { required: "Description is required" })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg 
                                 text-text placeholder-gray-400 focus:outline-none focus:ring-2 
                                 focus:ring-primary/50 focus:border-primary transition-all duration-200
                                 resize-none"
                      />
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {videoMutation.isPending && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text">Uploading...</span>
                        <span className="text-primary">Processing</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse" 
                             style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={closeModal}
                      className="flex-1"
                      disabled={videoMutation.isPending}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      loading={videoMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={videoMutation.isPending}
                    >
                      {videoMutation.isPending ? (
                        "Uploading..."
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4" />
                          Upload Video
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
