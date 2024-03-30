"use client";
import React, { useEffect, useState, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { runDetector } from "../utils/runDetector";
import { getStoredSetup, storeSetup } from "../utils/storeSetup";
import Webcam from "react-webcam";
import Menu from "./nav/Menu";
import Splash from "./nav/Splash";
import Drawing from "./Drawing";
import Cursor from "./Cursor";
import "../styles.scss";
import { scratchCanvas } from "../utils/scratchCanvas";

const targetResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const initialSetup = getStoredSetup();

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [points, setPoints] = useState([]);
  const [scribble, setScribble] = useState([]);
  const [scribbleNewArea, setScribbleNewArea] = useState([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0, isPinched: false });
  const [setup, setSetup] = useState(initialSetup);

  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        setSetup((prevSetup) => {
          return { ...prevSetup, isSpacePressed: true };
        });
      }
    };
    const handleKeyUp = (event) => {
      if (event.key === " ") {
        setSetup((prevSetup) => {
          return { ...prevSetup, isSpacePressed: false };
        });
      }
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
    if (cursor.isWagging && setup.pattern !== "canvas") {
      clearPaths();
    }
  }, [cursor.isWagging, setup.pattern]);

  const clearPaths = () => {
    setScribble([]);
    setScribbleNewArea([]);
    setPoints([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

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

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [stopDetector, setStopDetector] = useState(null);
  const [shouldRunDetector, setShouldRunDetector] = useState(false);
  const [inputResolution, setInputResolution] = useState(targetResolution);
  const { width, height } = inputResolution;

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (isLoaded) return;
    if (shouldRunDetector) {
      const { videoWidth, videoHeight } = video;
      if (inputResolution.width >= 768) {
        setInputResolution({ width: videoWidth, height: videoHeight });
      }
      const ctx = canvasRef.current?.getContext("2d");
      runDetector({
        setupRef,
        video,
        setPoints,
        setCursor,
        setScribble,
        setScribbleNewArea,
        ctx: ctx || null
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
            className={`wrap canvas ${
              setup.pattern !== "canvas" ? "hidden" : ""
            }`}
            ref={canvasRef}
            width={width}
            height={height}
            style={{ mixBlendMode: setup.blendMode }}
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
          <Cursor
            cursor={cursor}
            hasCursor={setup.hasCursor}
            isScratchCanvas={setup.isScratchCanvas}
          />
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
      {/* <pre>{JSON.stringify(setup.scratchPoints, null, 4)}</pre> */}
    </div>
  );
};

export default App;
