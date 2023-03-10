import type { RefObject } from "react";

type PanelProps = {
  panelRef: RefObject<HTMLDivElement>;
  isFileSubmitted: boolean;
  title: JSX.Element;
  input: JSX.Element;
  canvas: JSX.Element;
  downloadButton: JSX.Element;
};

export const Panel = ({
  panelRef,
  isFileSubmitted,
  title,
  input,
  canvas,
  downloadButton,
}: PanelProps) => {
  return (
    <div
      ref={panelRef}
      className="w-full h-full max-w-sm overflow-hidden rounded-md border-2 border-gray-700/40 bg-base-100 p-6 shadow"
    >
      {title}
      {input}
      {canvas}
      {isFileSubmitted ? downloadButton : <></>}
    </div>
  );
};
