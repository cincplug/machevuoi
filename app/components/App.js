"use client";
import React, { useEffect, useState, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { runDetector } from "../utils/runDetector";
import { getStoredSetup, storeSetup } from "../utils/storeSetup";
import Webcam from "react-webcam";
import Menu from "./nav/Menu";
import Splash from "./nav/Splash";
import Message from "./nav/Message";
import Drawing from "./Drawing";
// import Cursor from "./Cursor";
import "../styles.scss";
import { clearCanvases } from "../utils";

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [points, setPoints] = useState([]);
  const [scribble, setScribble] = useState([]);
  const [scribbleNewArea, setScribbleNewArea] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0, isPinched: false });
  const [setup, setSetup] = useState({});
  const [stopDetector, setStopDetector] = useState(null);
  const [shouldRunDetector, setShouldRunDetector] = useState(false);
  const [inputResolution, setInputResolution] = useState({
    width: 0,
    height: 0
  });
  const [message, setMessage] = useState("");

  const setupRef = useRef(setup);
  const webcamRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSetup(getStoredSetup());
      setInputResolution({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key) {
        setSetup((prevSetup) => {
          return { ...prevSetup, pressedKey: event.key };
        });
      }
    };
    const handleKeyUp = (event) => {
      setSetup((prevSetup) => {
        return { ...prevSetup, pressedKey: "" };
      });
      if (event.key === "Backspace") {
        clearPaths();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (setup.doesWagDelete && cursor.isWagging && setup.pattern !== "canvas") {
      clearPaths();
    }
  }, [cursor.isWagging, setup.pattern, setup.doesWagDelete]);

  useEffect(() => {
    if (!cursor.isPinched && scribbleNewArea.length > 0) {
      if (scribbleNewArea.length > 0) {
        setScribbleNewArea((prevScribbleNewArea) => {
          setScribble((prevScribble) => {
            return [...prevScribble, prevScribbleNewArea];
          });
          return [];
        });
      }
    }
  }, [cursor.isPinched, scribbleNewArea.length]);

  const handleInputChange = (event) => {
    setSetup((prevSetup) => {
      const { id, value, type } = event.target;
      const nextSetup = { ...prevSetup };
      if (type === "checkbox") {
        nextSetup[id] = !nextSetup[id];
      } else {
        nextSetup[id] = ["number", "range"].includes(type) ? value / 1 : value;
      }
      storeSetup(nextSetup);
      return nextSetup;
    });
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    if (shouldRunDetector) {
      const { videoWidth, videoHeight } = video;
      if (inputResolution.width >= 768) {
        setInputResolution({ width: videoWidth, height: videoHeight });
      }
      const dctx = drawingCanvasRef.current?.getContext("2d") || null;
      const pctx = previewCanvasRef.current?.getContext("2d") || null;
      dctx.globalCompositeOperation = setup.composite;
      pctx.globalCompositeOperation = "destination-atop";
      runDetector({
        setupRef,
        video,
        setPoints,
        setCursor,
        setScribble,
        setScribbleNewArea,
        dctx,
        pctx,
        setMessage
      }).then((stopDetectorCallback) => {
        setStopDetector(() => stopDetectorCallback);
      });
    }
    setIsLoaded(true);
  };

  const handlePlayButtonClick = (event) => {
    setIsStarted((prevIsStarted) => {
      setSetup((prevSetup) => {
        if (stopDetector && prevIsStarted) {
          try {
            stopDetector();
          } catch (error) {
            console.error("An error occurred:", error);
          }
          setIsLoaded(false);
        }
        setShouldRunDetector(!prevIsStarted);
        return prevSetup;
      });
      return !prevIsStarted;
    });
  };

  const clearPaths = () => {
    setScribble([]);
    setScribbleNewArea([]);
    setPoints([]);
    clearCanvases();
  };

  const { width, height } = inputResolution;

  return (
    <div
      className={`wrap wrap--main wrap--${
        isStarted && isLoaded ? "started" : "not-started"
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
            <rect width={width} height={height} fill={setup.bg}></rect>
          </svg>
          <Webcam
            audio={false}
            ref={webcamRef}
            width={width}
            height={height}
            style={{
              opacity: setup.videoOpacity / 255,
              position: "absolute"
            }}
            videoConstraints={inputResolution}
            forceScreenshotSourceSize={true}
            onLoadedData={handleVideoLoad}
            mirrored={true}
            imageSmoothing={false}
          />
          <canvas
            className={`canvas ${setup.pattern !== "canvas" ? "hidden" : ""}`}
            ref={previewCanvasRef}
            width={width}
            height={height}
          ></canvas>
          <canvas
            className={`canvas ${setup.pattern !== "canvas" ? "hidden" : ""}`}
            ref={drawingCanvasRef}
            width={width}
            height={height}
          ></canvas>
          {setup.pattern !== "canvas" && (
            <Drawing
              {...{
                inputResolution,
                setup,
                points,
                cursor,
                scribble,
                scribbleNewArea
              }}
            />
          )}
          <button
            className="splash-button video-button pause-button"
            onClick={handlePlayButtonClick}
          >
            Stop camera
          </button>
          {/* <Cursor
            cursor={cursor}
            hasCursor={setup.hasCursor}
            isScratchCanvas={setup.isScratchCanvas}
          /> */}
        </>
      ) : (
        <Splash {...{ handlePlayButtonClick }} />
      )}
      <Menu
        {...{
          setup,
          handleInputChange,
          setSetup,
          setPoints,
          clearPaths
        }}
      />
      {message && <Message {...{ message, setMessage }} />}
      {/* <pre>{JSON.stringify(setup, null, 4)}</pre> */}
    </div>
  );
};

export default App;
