import { Spinner, Stack } from "@chakra-ui/react";
import TodoItem from "../TodoItem/TodoItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL, Todo } from "../lib/types";

const TodoList = () => {
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/todos`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        return data || [];
      } catch (error) {
        throw Error;
      }
    },
  });

  return (
    <>
      <p className="text-4xl uppercase font-semibold text-center my-2">
        Today's Tasks
      </p>
      {isLoading && (
        <div className="flex justify-center my-4">
          <Spinner size={"lg"} />
        </div>
      )}
      {!isLoading && todos?.length === 0 && (
        <p className="text-xl text-center text-gray-500">No tasks.</p>
      )}
      <Stack gap={3}>
        {todos?.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </Stack>
    </>
  );
};

export default TodoList;
