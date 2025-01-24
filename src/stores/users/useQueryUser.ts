import { useQuery } from "@tanstack/react-query";
import { getAllUserService } from "@/stores/users/services";

const useQueryUser = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUserService,
    staleTime: 1000 * 60 * 5,
    enabled: true,
    select: (data) => {
      return data.sort(
        (a, b) =>
          new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime(),
      );
    },
  });

  return { data, error, isLoading };
};

export default useQueryUser;
