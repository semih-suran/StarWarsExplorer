import React from "react";
import { Navigation } from "./components/Navigation/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4">{children}</div>
    </>
  );
};