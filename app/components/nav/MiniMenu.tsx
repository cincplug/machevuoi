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
  const { isMenuVisible } = setup;

  const handleMenuButtonClick = () => {
    updateSetup({
      id: "isMenuVisible",
      value: !setup.isMenuVisible,
      type: "checkbox"
    });
  };

  return (
    <aside className="mini-menu">
      <button
        className={`control button pause-button ${isStarted ? "cancel" : ""}`}
        onClick={handlePlayButtonClick}
      >
        {isStarted ? "Stop camera" : "Start camera"}
      </button>
      <button
        className={`control button menu-button ${
          isMenuVisible ? "cancel" : ""
        }`}
        onClick={handleMenuButtonClick}
      >
        {isMenuVisible ? "Hide menu" : "Show menu"}
      </button>
    </aside>
  );
};

export default MiniMenu;
