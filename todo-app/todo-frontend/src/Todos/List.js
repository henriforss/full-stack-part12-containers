import React from "react";
import Todo from "./Todo";

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo);
  };

  const onClickComplete = (todo) => () => {
    completeTodo(todo);
  };

  return (
    <>
      {todos
        .map((todo, index) => {
          return (
            <Todo
              key={index}
              todo={todo}
              onClickDelete={onClickDelete}
              onClickComplete={onClickComplete}
            />
          );
        })
        .reduce(
          (acc, cur, index) => [...acc, <hr key={`hr-${index}`} />, cur],
          []
        )}
    </>
  );
};

export default TodoList;
