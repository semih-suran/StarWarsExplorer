import { render as testRenderer } from "@testing-library/react";
import { BrowserRouter } from "react-router";

const customRender = (component: React.ReactNode | React.ReactElement) => {
  return testRenderer(<BrowserRouter>{component}</BrowserRouter>);
};

export * from "@testing-library/react";
export { customRender as render };
