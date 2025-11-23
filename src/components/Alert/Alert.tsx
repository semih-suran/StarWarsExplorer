import { cn } from "@/utilities/cn";

type Props = {
  message: string;
  type?: "error" | "warning" | "info" | "success";
};

export const Alert = ({ message, type = "error" }: Props) => {
  return (
    <div
      role="alert"
      className={cn("alert", {
        "alert-error": type === "error",
        "alert-warning": type === "warning",
        "alert-info": type === "info",
        "alert-success": type === "success",
      })}
      data-testid="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Error! {message}</span>
    </div>
  );
};
