import { Badge } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TodoItem = ({ todo }: { todo: any }) => {
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
        <button>
          <FaCheckCircle size={20} className="text-green-500" />
        </button>
        <button>
          <MdDelete size={25} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
