import { Container, Stack } from "@chakra-ui/react"
import Navbar from "./Navbar/Navbar";
import TodoForm from "./TodoForm/TodoForm";
import TodoList from "./TodoList/TodoList";

const App = () => {
  return (
    <Stack h="100vh" className="max-w-screen-2xl mx-auto transition-all">
      <Navbar />
      <Container>
        <TodoForm />
        <TodoList />
      </Container>
    </Stack>
  )
}

export default App