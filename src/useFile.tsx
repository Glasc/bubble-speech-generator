import { useEffect, useRef, useState } from "react";
import { z } from "zod";

type useFileProps = React.RefObject<HTMLCanvasElement> | null;

export const useFile = (canvasRef: useFileProps) => {
  const [errorNotification, setErrorNotification] = useState("");
  const [warningNotification, setWarningNotification] = useState("");
  const [isFileSubmitted, setIsFileSubmitted] = useState(false);

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
          "Only these formats are allowed: jpeg, png, jpg, webp y jfif."
        );
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async ({ target }) => {
        const result = z.string().parse(target?.result);
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;

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
      setIsFileSubmitted(true);
    } catch (err) {
      if (err === "No file selected.") {
        setErrorNotification("");
        setWarningNotification(err);
      } else {
        setWarningNotification("");
        setErrorNotification(
          "Only these formats are allowed: jpeg, png, jpg, webp y jfif."
        );
      }
      setIsFileSubmitted(false);
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

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current;

    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.download = z
      .string()
      .min(8)
      .parse(crypto.randomUUID().split("").slice(0, 8).join("") + ".jpg");

    link.click();
  };

  return {
    errorNotification,
    warningNotification,
    isFileSubmitted,
    handleDownload,
    handleFileChange,
    handleUpload,
    canvasRef,
  };
};
