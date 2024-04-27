import React, { useState } from "react";
import { ISetup, UpdateSetupType } from "../../../types";

interface IProps {
  setup: ISetup;
  updateSetup: (event: UpdateSetupType) => void;
  handlePlayButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Info: React.FC<IProps> = ({
  setup,
  updateSetup,
  handlePlayButtonClick
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { pattern, isScratchCanvas } = setup;
  const handleMenuButtonClick = () => {
    updateSetup({
      id: "isMenuVisible",
      value: !setup.isMenuVisible,
      type: "checkbox"
    });
  };
  const pauseButton = (
    <button
      className="info-close pause-button cancel"
      onClick={handlePlayButtonClick}
    >
      Stop camera
    </button>
  );
  const menuToggleButton = (
    <button
      className="info-close pause-button cancel"
      onClick={handleMenuButtonClick}
    >
      ...
    </button>
  );
  return isVisible ? (
    <>
      <div className="info">
        <section>
          <p>You can draw in three ways:</p>
          <ol>
            <li>By pinching your fingers 🤌 (ma che vuoi?)</li>
            <li>By holding Shift key while drawing</li>
            <li>By turning on Caps Lock</li>
          </ol>
          <p>Wag your forefinger 👆 (basta) to erase</p>
        </section>
        <section>
          {pattern !== "canvas" || !isScratchCanvas ? (
            <p>In this mode, you use your thumb and forefinger draw 👌</p>
          ) : (
            <p>In this mode, you use your whole hand to draw 🖐️🤘🫱✌️</p>
          )}
          {pattern === "canvas" ? (
            <>
              <p>Line width is influenced by tightness of your grip</p>
              <p>You can use both of your hands, try it</p>
              <p>You can save your work as PNG</p>
            </>
          ) : (
            <>
              <p>Line width is fixed and only one hand can draw</p>
              <p>You can add text along your drawing</p>
              <p>You can save your work as SVG</p>
            </>
          )}
        </section>
      </div>
      <div className="info-buttons">
        <button
          className="info-close cancel"
          onClick={() => setIsVisible(false)}
        >
          Hide info
        </button>
        {menuToggleButton}
        {pauseButton}
      </div>
    </>
  ) : (
    <div className="info-buttons">
      <button className="info-close" onClick={() => setIsVisible(true)}>
        Show info
      </button>
      {menuToggleButton}
      {pauseButton}
    </div>
  );
};

export default Info;
