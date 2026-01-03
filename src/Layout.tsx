import { Navigation } from "@/components/Navigation/Navigation";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
         <Outlet /> 
      </main>
    </div>
  );
};