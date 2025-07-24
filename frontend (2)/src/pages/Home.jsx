import { Loader, VideoCard } from "../components";
import getAllVudeo from "../hooks/react-query/query/videos/getAllVudeo.jsx";
import useTrendingVideos from "../hooks/react-query/query/videos/useTrendingVideos";

const Home = () => {
  const { data: backendVideos, isLoading: loadingBackend } = getAllVudeo();
  const { data: trendingVideos, isLoading: loadingRapid } = useTrendingVideos();

  if (loadingBackend || loadingRapid) return <Loader />;

  const rapidAdapted = (trendingVideos || [])
    .filter((vid) => vid?.type === "video")
    .map((vid, i) => ({
      _id: `yt-${vid.video.videoId || i}`,
      title: vid.video.title,
      thumbnail: { url: vid.video.thumbnails?.[1]?.url },
      owner: {
        avatar: vid.video.author?.avatar?.[0]?.url,
        userName: vid.video.author?.title,
      },
      views: vid.video.stats?.views,
    }));

  const allVideos = [...(backendVideos?.docs || []), ...rapidAdapted];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1600px] px-4 py-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
          {allVideos.map((vid) => (
            <li key={vid._id} className="list-none">
              <VideoCard {...vid} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;


