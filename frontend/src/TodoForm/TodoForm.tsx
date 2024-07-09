import { Button, Input, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");
  const [isPending, setIsPending] = useState(false);

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${newTodo} added to list.`);
  };

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
