import { Badge, Spinner } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BASE_URL, Todo } from "../lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient()

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
            "Content-Type": "application/json; charset=utf-8"
          }
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
        queryKey: ["todos"]
      })
    }
  });

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-1 items-center border border-gray-600 p-2 rounded-md justify-between">
        <p
          className={
            todo.completed
              ? "text-green-400 line-through"
              : "text-yellow-400 none"
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
      </div>
      <div className="flex gap-2 items-center">
        <button onClick={() => updateTodo()}>
          {!isUpdating ? (
            <FaCheckCircle size={20} className="text-green-500" />
          ) : (
            <Spinner size={"sm"} />
          )}
        </button>
        <button>
          <MdDelete size={25} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
