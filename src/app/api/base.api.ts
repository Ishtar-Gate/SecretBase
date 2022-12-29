import { useQueryClient, useMutation } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";

export const useInvalidateMutation = <TArguments, TResult>(
  querykey: Array<unknown>,
  func: (args: TArguments) => Promise<TResult>,
  successMsg = "Done",
  failMsg = "Failed"
) => {
  const queryClient = useQueryClient();

  return useMutation(func, {
    onSuccess: () => {
      queryClient.invalidateQueries(querykey);

      showNotification({ autoClose: 5000, message: successMsg, color: "green" });
    },
    onError: (error) => {
      process.env.NODE_ENV !== "production" && console.error(error);
      showNotification({ autoClose: 5000, message: failMsg, color: "red" });
    },
  });
};
