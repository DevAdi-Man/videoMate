// src/hooks/react-query/query/videos/useTrendingVideos.js
import { useQuery } from "@tanstack/react-query";
import { rapidApi } from "../../../../services/rapidApi";

const useTrendingVideos = () => {
  return useQuery({
    queryKey: ["trendingVideos"],
    queryFn: async () => {
      const res = await rapidApi.get("/search", {
        params: {
          q: "trending",
          hl: "en",
          gl: "US",
        },
      });
      return res.data.contents;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useTrendingVideos;
