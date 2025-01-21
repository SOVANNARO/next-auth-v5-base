import { useQuery } from "@tanstack/react-query";
import { getAllUserService } from "@/stores/users/services";

const useUserQuery = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getAllUserService,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  })

export default useUserQuery;