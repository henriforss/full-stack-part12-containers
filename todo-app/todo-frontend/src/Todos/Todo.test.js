import React from "react";
import { render } from "@testing-library/react";
import Todo from "./Todo";

test("renders todo correctly", () => {
  const onClickDelete = jest.fn();
  const onClickComplete = jest.fn();

  const { getByText } = render(
    <Todo
      todo={{ done: false, text: "This is a test" }}
      onClickComplete={onClickComplete}
      onClickDelete={onClickDelete}
    />
  );
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const todoElement = getByText(/This is a test/i);

  expect(todoElement).toBeInTheDocument();
});
