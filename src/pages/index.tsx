import { type NextPage } from "next";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { ErrorAlert, WarningAlert } from "../Alert";
import { Layout } from "../Layout";
import { Panel } from "../Panel";
import { useFile } from "../useFile";

const Home: NextPage = () => {
  const mainRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    errorNotification,
    warningNotification,
    isFileSubmitted,
    handleDownload,
    handleFileChange,
    handleUpload,
  } = useFile(canvasRef);

  useEffect(() => {
    const main = mainRef?.current;
    const panel = panelRef?.current;
    if (!main || !panel) return;

    const changeBackground = (background: string) => {
      main.style.backgroundColor = background;
    };

    main.addEventListener("dragover", (e) => {
      e.preventDefault();
      changeBackground("#291d2b");
    });

    main.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0]);
      if (!file.success) return;
      changeBackground("");
      handleUpload(file.data);
    });

    main.addEventListener("dragleave", () => {
      changeBackground("");
    });

    panel.addEventListener("dragleave", () => {
      changeBackground("");
    });

    panel.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0]);
      if (!file.success) return;

      main.style.backgroundColor = "";
      panel.style.backgroundColor = "";

      handleUpload(file.data);
    });
  }, [handleUpload]);

  return (
    <Layout
      Alerts={
        <>
          <WarningAlert isVisible={Boolean(warningNotification)}>
            {warningNotification}
          </WarningAlert>
          <ErrorAlert isVisible={Boolean(errorNotification)}>
            {errorNotification}
          </ErrorAlert>
        </>
      }
    >
      <main
        ref={mainRef}
        className="relative flex min-h-screen items-center justify-center bg-base-300 py-4 px-4 md:px-0"
      >
        <Panel
          panelRef={panelRef}
          isFileSubmitted={isFileSubmitted}
          title={
            <h1 className="mb-5 text-center text-xl font-bold text-primary md:text-3xl ">
              Speech Bubble Generator
            </h1>
          }
          input={
            <input
              className="file-input-bordered file-input file-input-sm mt-2 w-full"
              type="file"
              onChange={handleFileChange}
            />
          }
          canvas={
            <canvas
              ref={canvasRef}
              className={`${
                isFileSubmitted ? "mt-5" : "m-0"
              } w-full overflow-hidden`}
              width={0}
              height={0}
              id="capture"
            ></canvas>
          }
          downloadButton={
            <button
              className="btn-primary btn mt-6 w-full "
              onClick={handleDownload}
            >
              Download
            </button>
          }
        />
      </main>
    </Layout>
  );
};

export default Home;
