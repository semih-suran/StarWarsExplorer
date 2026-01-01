import type { ReactNode } from "react";
import { Alert } from "@/components/Alert/Alert";
import { Loading } from "@/components/Loading/Loading";

type Props = {
  title: string;
  isLoading: boolean;
  error: Error | null;
  children: ReactNode;
};

export const ResourceLayout = ({ title, isLoading, error, children }: Props) => {
  if (isLoading) return <Loading />;
  if (error) return <Alert message={error.message} type="error" />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 drop-shadow-md text-center">
        {title}
      </h1>
      {children}
    </div>
  );
};