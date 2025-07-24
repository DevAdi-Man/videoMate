import { Link, useParams } from "react-router-dom";
import { BiLike } from "react-icons/bi";
import { Button, CommentSection } from "../components";
import videoQuery from "../hooks/react-query/query/videos/videoQuery.jsx";
import toggleSubscribeQuery from "../hooks/react-query/mutation/subscribe/toggleSubscribeQuery.jsx";
import likeToggleQuery from "../hooks/react-query/mutation/Like/likeToggleQuery.jsx";
import Swal from "sweetalert2/dist/sweetalert2.js";
const Videos = () => {
  const { slug } = useParams();
  const { data: video } = videoQuery(slug);

  const { mutate: subscribe } = toggleSubscribeQuery(
    video?.owner?._id,
    video?._id
  );
  const { mutate: Like } = likeToggleQuery(video?._id);

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Main Video Section */}
          <div className="w-full lg:w-[70%]">
            <div className="video flex justify-center">
              <video
                src={video?.videoFile?.url}
                controls
                autoPlay
                className="rounded-lg w-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="mt-4 rounded-xl p-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h1 className="text-lg font-bold">{video?.title}</h1>
                  <p className="text-sm text-gray-400">
                    {video?.views} views · 18 hours ago
                  </p>
                </div>
                <Button
                  onClick={() => Like()}
                  className="px-4 py-1 rounded-2xl flex items-center gap-1 text-white"
                >
                  <BiLike /> {video?.likeCount}
                </Button>
              </div>

              <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={video?.owner?.avatar}
                    alt="channel avatar"
                  />
                  <div>
                    <Link to={`/channel/${video?.owner?._id}`}>
                      <p className="text-green-200 font-medium">
                        {video?.owner?.userName}
                      </p>
                    </Link>
                    <p className="text-sm text-green-200">
                      {video?.owner?.subscriberCount} Subscribers
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => subscribe()}
                  className="px-4 py-1 rounded-2xl text-white"
                >
                  {video?.owner?.isSubscribed ? "unsubscribe" : "subscribe"}
                </Button>
              </div>

              <hr className="my-4 border-white" />

              <p className="text-sm text-white">{video?.description}</p>
            </div>

            {/* Comment Section */}
            <CommentSection slug={slug} />
          </div>

          {/* Recommended Videos Section */}
          <div className="w-full lg:w-[30%] space-y-4">
            <div className="text-white font-semibold text-lg">Recommended</div>

            {/* Replace this block with real videos later */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-40 h-24 bg-gray-700 rounded"></div>
                <div className="flex flex-col text-white text-sm">
                  <p className="font-medium">Video Title {i + 1}</p>
                  <p className="text-gray-400">Channel Name</p>
                  <p className="text-gray-500 text-xs">
                    15K views • 3 days ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Videos;
