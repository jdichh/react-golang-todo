import { Badge, Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BASE_URL, Todo } from "../lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      if (todo.completed) {
        return alert("Todo already completed.");
      }

      try {
        const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {
      try {
        const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return (
    <div className="flex gap-2 items-center">
      <Box bg={useColorModeValue("gray.300", "gray.700")} className="flex flex-1 items-center p-2 rounded-md justify-between">
        <p
          className={
            todo.completed
              ? "line-through"
              : "none"
          }
        >
          {todo.body}
        </p>

        {todo.completed && (
          <Badge ml="1" colorScheme="green">
            Done
          </Badge>
        )}
        {!todo.completed && (
          <Badge ml="1" colorScheme="yellow">
            In Progress
          </Badge>
        )}
      </Box>
      <div className="flex gap-2 items-center">
        <button onClick={() => updateTodo()}>
          {!isUpdating ? (
            <FaCheckCircle size={20} className="text-green-500" />
          ) : (
            <Spinner size={"sm"} />
          )}
        </button>
        <button onClick={() => deleteTodo()}>
          {!isDeleting ? (
            <MdDelete size={25} className="text-red-500" />
          ) : (
            <Spinner size={"sm"} />
          )}
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
