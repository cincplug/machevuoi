"use client";
import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import Image from "next/image";
import { clearCanvases } from "../utils";
import { runDetector } from "../utils/runDetector";
import { getStoredSetup, storeSetup } from "../utils/storeSetup";
import Menu from "./nav/Menu";
import MiniMenu from "./nav/MiniMenu";
import Splash from "./nav/Splash";
import Message from "./nav/Message";
import Drawing from "./Drawing";
import "../styles.scss";
import { ISetup, ICursor, UpdateSetupType } from "../../types";

interface InputResolution {
  width: number;
  height: number;
}

const App: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isSetupLoaded, setIsSetupLoaded] = useState<boolean>(false);
  const [isDetectorRunning, setIsDetectorRunning] = useState<boolean>(false);
  const [scribble, setScribble] = useState<any[]>([]);
  const [scribbleNewArea, setScribbleNewArea] = useState<any[]>([]);
  const [cursor, setCursor] = useState<ICursor>({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    isPinched: false,
    isWagging: false
  });
  const [setup, setSetup] = useState<ISetup>(getStoredSetup());
  const [stopDetector, setStopDetector] = useState<Function | null>(null);
  const [shouldRunDetector, setShouldRunDetector] = useState<boolean>(false);
  const [inputResolution, setInputResolution] = useState<InputResolution>({
    width: 0,
    height: 0
  });
  const [message, setMessage] = useState<string>("");

  const setupRef = useRef<ISetup>(setup);
  const webcamRef = useRef<Webcam | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (inputResolution.width <= 767) {
      setSetup((prevSetup) => {
        return { ...prevSetup, isMenuVisible: false };
      });
    }
  }, [inputResolution.width]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSetup(getStoredSetup());
      setIsSetupLoaded(true);
    }
    if (typeof window !== "undefined") {
      setInputResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        setSetup((prevSetup) => {
          return { ...prevSetup, pressedKey: event.key };
        });
      }

      if (event.key === "CapsLock") {
        const isCapsLock =
          event.getModifierState && event.getModifierState("CapsLock");
        setSetup((prevSetup) => {
          return { ...prevSetup, isCapsLock: isCapsLock };
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setSetup((prevSetup) => {
        return { ...prevSetup, pressedKey: "" };
      });

      if (event.key === "CapsLock") {
        const isCapsLock =
          event.getModifierState && event.getModifierState("CapsLock");
        setSetup((prevSetup) => {
          return { ...prevSetup, isCapsLock: isCapsLock };
        });
      }

      if (event.key === "Backspace") {
        clearPaths();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [isClient]);

  useEffect(() => {
    if (setup.doesWagDelete && cursor.isWagging && setup.pattern !== "canvas") {
      clearPaths();
    }
  }, [cursor.isWagging, setup.pattern, setup.doesWagDelete]);

  useEffect(() => {
    if (!cursor.isPinched && scribbleNewArea.length > 0) {
      setScribble((prevScribble) => [...prevScribble, [...scribbleNewArea]]);
      setScribbleNewArea([]);
    }
  }, [cursor.isPinched, scribbleNewArea]);

  const updateSetup = ({ id, value, type }: UpdateSetupType) => {
    setSetup((prevSetup) => {
      const nextSetup = { ...prevSetup };
      if (type === "checkbox") {
        nextSetup[id] = !nextSetup[id];
      } else {
        nextSetup[id] = ["number", "range"].includes(type)
          ? Number(value)
          : value;
      }
      storeSetup(nextSetup);
      return nextSetup;
    });
  };

  const handlePlayButtonClick = (
    _event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setIsStarted((prevIsStarted) => {
      setSetup((prevSetup) => {
        if (stopDetector && prevIsStarted) {
          try {
            stopDetector();
          } catch (error) {
            console.error("An error occurred:", error);
          }
          setIsVideoLoaded(false);
        }
        setShouldRunDetector(!prevIsStarted);
        if (inputResolution.width <= 767) {
          prevSetup.isMenuVisible = false;
        }
        return prevSetup;
      });
      return !prevIsStarted;
    });
  };

  const handleVideoLoad = (
    videoNode: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = videoNode.currentTarget;
    if (video.readyState !== 4) return;
    if (isVideoLoaded) return;
    if (shouldRunDetector) {
      const dctx = drawingCanvasRef.current?.getContext("2d") || null;
      const pctx = previewCanvasRef.current?.getContext("2d") || null;
      runDetector({
        setupRef,
        video,
        setCursor,
        setScribbleNewArea,
        setIsDetectorRunning,
        dctx,
        pctx,
        setMessage
      }).then((stopDetectorCallback) => {
        if (stopDetectorCallback) {
          setStopDetector(() => stopDetectorCallback);
        }
      });
    }
    setIsVideoLoaded(true);
  };

  const clearPaths = () => {
    setScribble([]);
    setScribbleNewArea([]);
    clearCanvases();
  };

  const { width, height } = inputResolution;

  if (!isSetupLoaded) {
    return null;
  }

  return (
    <div
      className={`wrap ${
        isStarted && isVideoLoaded ? "started" : "not-started"
      } theme theme-${setup.theme}`}
      style={{ width, height }}
    >
      {isStarted ? (
        <>
          <svg
            className="bg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            style={{ width, height }}
          >
            <rect
              width={width}
              height={height}
              fill={setup.bg as string}
            ></rect>
          </svg>
          <Webcam
            audio={false}
            ref={webcamRef}
            width={width}
            height={height}
            style={{
              opacity: setup.videoOpacity / 255
            }}
            videoConstraints={inputResolution}
            forceScreenshotSourceSize={true}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          <canvas
            className={`canvas preview-canvas ${
              setup.pattern !== "canvas" ? "hidden" : ""
            }`}
            ref={previewCanvasRef}
            width={width}
            height={height}
          ></canvas>
          <canvas
            className={`canvas drawing-canvas ${
              setup.pattern !== "canvas" ? "hidden" : ""
            }`}
            ref={drawingCanvasRef}
            width={width}
            height={height}
          ></canvas>
          {setup.pattern !== "canvas" && (
            <>
              <Drawing
                {...{
                  inputResolution,
                  setup,
                  scribble,
                  scribbleNewArea,
                  cursor
                }}
              />
            </>
          )}
        </>
      ) : (
        <Splash {...{ handlePlayButtonClick }} />
      )}
      {setup.isMenuVisible && isSetupLoaded && (
        <Menu
          {...{
            isStarted,
            setup,
            setSetup,
            updateSetup,
            clearPaths
          }}
        />
      )}
      <MiniMenu {...{ setup, isStarted, updateSetup, handlePlayButtonClick }} />
      {message && <Message {...{ message, setMessage }} />}
      {isStarted && !isDetectorRunning && (
        <Image
          className="loader"
          src="/spinner.svg"
          alt="Loading"
          width={100}
          height={100}
        />
      )}
    </div>
  );
};

export default App;
