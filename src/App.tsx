import { useEffect, useRef } from "react"
import { z } from "zod"
import { ErrorAlert, WarningAlert } from "./components/Alert"
import { Layout } from "./components/Layout"
import { Panel } from "./components/Panel"
import { useFile } from "./hooks/useFile"

const App = () => {
  const mainRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const fileHandler = useFile(canvasRef)

  useEffect(() => {
    const main = mainRef?.current
    const panel = panelRef?.current
    if (!main || !panel) return

    const changeBackground = (background: string) => {
      main.style.backgroundColor = background
    }

    main.addEventListener("dragover", (e) => {
      e.preventDefault()
      changeBackground("#291d2b")
    })

    main.addEventListener("drop", (e) => {
      e.preventDefault()
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0])
      if (!file.success) return
      changeBackground("")
      fileHandler.handleUpload(file.data)
    })

    main.addEventListener("dragleave", () => {
      changeBackground("")
    })

    panel.addEventListener("dragleave", () => {
      changeBackground("")
    })

    panel.addEventListener("drop", (e) => {
      e.preventDefault()
      const file = z.instanceof(File).safeParse(e.dataTransfer?.files[0])
      if (!file.success) return

      main.style.backgroundColor = ""
      panel.style.backgroundColor = ""

      fileHandler.handleUpload(file.data)
    })
  }, [fileHandler.handleUpload])

  return (
    <Layout
      Alerts={
        <>
          <WarningAlert isVisible={Boolean(fileHandler.warningNotification)}>
            {fileHandler.warningNotification}
          </WarningAlert>
          <ErrorAlert isVisible={Boolean(fileHandler.errorNotification)}>
            {fileHandler.errorNotification}
          </ErrorAlert>
        </>
      }
    >
      <main
        ref={mainRef}
        className="relative flex min-h-screen items-center justify-center bg-base-300 py-4 px-4 md:px-0"
      >
        <div className="md:flex md:space-x-10">
          <Panel
            panelRef={panelRef}
            isFileSubmitted={fileHandler.isFileSubmitted}
            title={
              <h1 className="mb-5 text-center text-xl font-bold text-primary md:text-3xl ">
                Speech Bubble Generator
              </h1>
            }
            input={
              <input
                className="file-input-bordered file-input file-input-sm mt-2 w-full"
                type="file"
                onChange={fileHandler.handleFileChange}
              />
            }
            canvas={
              <canvas
                ref={canvasRef}
                className={`${
                  fileHandler.isFileSubmitted ? "mt-5" : "m-0"
                } w-full overflow-hidden`}
                width={0}
                height={0}
                id="capture"
              ></canvas>
            }
            downloadButton={
              <button
                className="btn-primary btn mt-6 w-full "
                onClick={fileHandler.handleDownload}
              >
                Download
              </button>
            }
          />
          <article className="hidden md:block space-y-1">
            <img
              className="w-36 sm:w-56"
              src="/showcase-before.png"
              alt="image before"
            />
            <span className="block text-center text-4xl text-accent font-bold">
              ↓
            </span>
            <img
              className="w-36 sm:w-56"
              src="/showcase-after.jpg"
              alt="image after"
            />
          </article>
        </div>
      </main>
    </Layout>
  )
}

export default App
