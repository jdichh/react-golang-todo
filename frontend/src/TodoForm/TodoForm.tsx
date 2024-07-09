import { Button, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../lib/types";

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");
  const queryClient = useQueryClient()

  const { mutate: createTodo, isPending } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const res = await fetch(BASE_URL + "/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: newTodo,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        setNewTodo("");
        return data;
      } catch (error) {
        throw Error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"]
      })
    },
    onError: (error) => {
      alert(error.message)
    }
  });

  return (
    <form onSubmit={createTodo}>
      <div className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          ref={(input) => input && input.focus()}
        />
        <Button type="submit" className="hover:scale-105 active:scale-95">
          {isPending ? <Spinner size={"xs"} /> : <IoMdAdd />}
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
