export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};

export const BASE_URL: string =
  import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api";
