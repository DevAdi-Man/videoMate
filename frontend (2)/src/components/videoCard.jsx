import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const VideoCard = ({ views, _id, title, thumbnail, owner }) => {
  return (
    <div className="w-full cursor-pointer">
      <Link to={`/video/${_id}`}>
        <div className="w-full aspect-video overflow-hidden rounded-xl">
          <img
            src={thumbnail?.url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="flex mt-3 gap-x-3">
        <Avatar
          alt="channel avatar"
          src={owner?.avatar}
          sx={{ width: 36, height: 36 }}
        />

        <div className="flex flex-col overflow-hidden">
          <h3 className="text-sm font-medium leading-snug line-clamp-2">
            {title}
          </h3>
          <Link
            to={`/channel/${owner?.userName}`}
            className="text-xs text-gray-400 mt-0.5 hover:text-white"
          >
            {owner?.userName}
          </Link>
          <p className="text-xs text-gray-500">{views} views • 44agos</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

