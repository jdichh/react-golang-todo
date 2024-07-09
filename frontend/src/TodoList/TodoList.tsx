import { Spinner, Stack } from "@chakra-ui/react";
import { useState } from "react";
import TodoItem from "../TodoItem/TodoItem";

const TodoList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const todos = [
    {
      _id: 1,
      body: "Buy groceries",
      completed: true,
    },
    {
      _id: 2,
      body: "Walk the dog",
      completed: false,
    },
    {
      _id: 3,
      body: "Do laundry",
      completed: false,
    },
    {
      _id: 4,
      body: "Cook dinner",
      completed: true,
    },
  ];

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
        <p className="text-xl text-center text-gray-500"> No tasks.</p>
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
