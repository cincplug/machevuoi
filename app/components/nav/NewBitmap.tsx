// NewBitmap.tsx
import React, { useState } from "react";
import { ISetup, UpdateSetupType } from "../../../types";
import exp from "constants";

interface NewBitmapProps {
  scratchPoints: ISetup["scratchPoints"];
  updateSetup: (event: UpdateSetupType) => void;
}

const isValidBitmapSource = (source: string): boolean => {
  if (source.startsWith("/")) return true;
  try {
    new URL(source);
    return true;
  } catch {
    return false;
  }
};

const NewBitmap: React.FC<NewBitmapProps> = ({
  scratchPoints,
  updateSetup
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newBitmapUrl, setNewBitmapUrl] = useState("");

  const handleBitmapAdd = (url: string) => {
    const newScratchPoints = { ...scratchPoints };
    if (!newScratchPoints[url]) {
      newScratchPoints[url] = [];
    }
    updateSetup({
      id: "scratchPoints",
      value: newScratchPoints,
      type: "hidden"
    });
    updateSetup({
      id: "activeLayer",
      value: url,
      type: "hidden"
    });
  };

  const handleUrlSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValidBitmapSource(newBitmapUrl)) {
      handleBitmapAdd(newBitmapUrl);
      setNewBitmapUrl("");
      setShowUrlInput(false);
    }
  };

  return (
    <>
      {showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="url-input-form">
          <input
            className="url-input"
            type="text"
            value={newBitmapUrl}
            onChange={(e) => setNewBitmapUrl(e.target.value)}
            placeholder="Enter image URL"
            autoFocus
          />
          <button type="submit" className="icon-button">
            ✓
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setShowUrlInput(false);
              setNewBitmapUrl("");
            }}
          >
            ✕
          </button>
        </form>
      ) : (
        <button
          className="url-input-toggle control button"
          onClick={() => setShowUrlInput(true)}
          title="Add new bitmap"
        >
          Add bitmap
        </button>
      )}
    </>
  );
};

export default NewBitmap;
