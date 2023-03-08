import { type NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ErrorAlert, WarningAlert } from "../Alert";
import { Layout } from "../Layout";

const Home: NextPage = () => {
  const [errorNotification, setErrorNotification] = useState("");
  const [warningNotification, setWarningNotification] = useState("");
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    try {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/jfif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Solo se permiten los formatos: jpeg, png, jpg, webp y jfif."
        );
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async ({ target }) => {
        const result = z.string().parse(target?.result);
        const canvas = z.instanceof(HTMLCanvasElement).parse(canvasRef.current);
        const ctx = z
          .instanceof(CanvasRenderingContext2D)
          .parse(canvas.getContext("2d"));
        const image1 = new Image();
        const image2 = new Image();

        const image1Promise = new Promise((resolve) => {
          image1.onload = resolve;
        });
        const image2Promise = new Promise((resolve) => {
          image2.onload = resolve;
        });

        image1.src = "/speech-bubble.png";
        image2.src = result;

        await Promise.all([image1Promise, image2Promise]).then(() => {
          const width = image2.naturalWidth;
          const height = image2.naturalHeight;
          const aspectRatio = width / height;
          if (!canvasRef?.current) return;
          canvasRef.current.height = 300 / aspectRatio + 50;
          canvasRef.current.width = 300;

          ctx.drawImage(image1, 0, 0, 300, 50);
          ctx.drawImage(image2, 0, 50, 300, 300 / aspectRatio);
        });
      };
      setIsEmpty(false);
    } catch (err) {
      if (err === "No se ha seleccionado ningún archivo.") {
        setErrorNotification("");
        setWarningNotification(err);
      } else {
        setWarningNotification("");
        setErrorNotification("Solo se permiten los formatos: jpeg, png y jpg.");
      }
      setIsEmpty(true);
      setTimeout(() => {
        setErrorNotification("");
        setWarningNotification("");
      }, 6000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = z.instanceof(File).safeParse(e.target.files?.[0]);
    if (!file.success) return;

    handleUpload(file.data);
  };

  useEffect(() => {
    const main = z.instanceof(HTMLElement).parse(mainRef?.current);
    const panel = z.instanceof(HTMLDivElement).parse(panelRef?.current);

    const changeBackground = (background: string) => {
      main.style.backgroundColor = background;
      panel.style.backgroundColor = background;
    };

    main.addEventListener("dragover", (e) => {
      changeBackground("#46465b");
      e.preventDefault();
    });

    main.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0]);
      if (!file.success) return;
      changeBackground("");
      handleUpload(file.data);
    });

    main.addEventListener("dragleave", (e) => {
      e.preventDefault();
      changeBackground("");
    });

    panel.addEventListener("dragleave", (e) => {
      e.preventDefault();
      changeBackground("");
    });

    panel.addEventListener("dragover", (e) => e.preventDefault());

    panel.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0]);
      if (!file.success) return;

      main.style.backgroundColor = "";
      panel.style.backgroundColor = "";

      handleUpload(file.data);
    });
  }, []);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const { current: canvas } = canvasRef;

    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.download = z
      .string()
      .min(8)
      .parse(crypto.randomUUID().split("").slice(0, 8).join("") + ".jpg");

    link.click();
  };

  return (
    <Layout>
      <main
        ref={mainRef}
        className="relative flex min-h-screen items-center justify-center bg-base-300 py-4 px-4 md:px-0"
      >
        <div
          ref={panelRef}
          className="w-full max-w-sm overflow-hidden border-2 border-gray-700/40 bg-base-100 p-6 shadow rounded-md"
        >
          <h1 className="mb-5 text-center text-xl font-bold text-primary md:text-3xl ">
            Speech Bubble Generator
          </h1>
          <input
            className="file-input-bordered file-input file-input-sm mt-2 w-full"
            type="file"
            onChange={handleFileChange}
          />
          <>
            {!isEmpty ? (
              <>
                <canvas
                  className="mt-5 w-full overflow-hidden"
                  width={0}
                  height={0}
                  id="capture"
                  ref={canvasRef}
                ></canvas>
                <button
                  className="btn-primary btn mt-6 w-full "
                  onClick={handleDownload}
                >
                  Download
                </button>
              </>
            ) : null}

            <ErrorAlert isVisible={Boolean(errorNotification)}>
              {errorNotification}
            </ErrorAlert>

            <WarningAlert isVisible={Boolean(warningNotification)}>
              {warningNotification}
            </WarningAlert>
          </>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
