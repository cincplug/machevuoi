import React from "react";
import { ISetup, UpdateSetupType } from "../../../types";

interface MiniMenuProps {
  setup: ISetup;
  isStarted: boolean;
  updateSetup: (event: UpdateSetupType) => void;
  handlePlayButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const MiniMenu: React.FC<MiniMenuProps> = ({
  setup,
  isStarted,
  updateSetup,
  handlePlayButtonClick
}) => {
  const { isInfoVisible, isMenuVisible } = setup;

  const handleMenuButtonClick = () => {
    updateSetup({
      id: "isMenuVisible",
      value: !setup.isMenuVisible,
      type: "checkbox"
    });
  };

  const InfoButton = () => (
    <button
      className={`control control--button info-button ${
        isInfoVisible ? "cancel" : ""
      }`}
      onClick={() =>
        updateSetup({
          id: "isInfoVisible",
          value: !isInfoVisible,
          type: "checkbox"
        })
      }
    >
      {isInfoVisible ? "Hide info" : "Show info"}
    </button>
  );

  const pauseButton = (
    <button
      className={`control control--button pause-button ${
        isStarted ? "cancel" : ""
      }`}
      onClick={handlePlayButtonClick}
    >
      {isStarted ? "Stop camera" : "Start camera"}
    </button>
  );

  const menuToggleButton = (
    <button
      className={`control control--button menu-button ${
        isMenuVisible ? "cancel" : ""
      }`}
      onClick={handleMenuButtonClick}
    >
      {isMenuVisible ? "Hide menu" : "Show menu"}
    </button>
  );

  return (
    <div className="mini-menu">
      <div className="row">{pauseButton}</div>
      <div className="row">
        <InfoButton />
        {menuToggleButton}
      </div>
    </div>
  );
};

export default MiniMenu;
