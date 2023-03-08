import type { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
  isVisible: boolean;
};

export const WarningAlert = ({ children, isVisible }: AlertProps) => {
  if (!isVisible) {
    return null;
  }
  return (
    <div
      className={`alert alert-warning fixed bottom-0 right-0 mx-auto mb-8 mr-8 w-auto shadow-lg`}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>{children}</span>
      </div>
    </div>
  );
};

export const ErrorAlert = ({ children, isVisible }: AlertProps) => {
  if (!isVisible) {
    return null;
  }
  return (
    <div
      className={`alert alert-error fixed bottom-0 right-0 mx-auto mb-8 mr-8 w-auto shadow-lg`}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
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
        <span>{children}</span>
      </div>
    </div>
  );
};
