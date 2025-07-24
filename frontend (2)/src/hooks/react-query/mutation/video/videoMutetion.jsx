// hooks/useVideoMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../services/axios";

const useVideoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      api.post(`api/v1/videos/publishVideo`, data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      }).then((res) => res?.data),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });
};

export default useVideoMutation;
