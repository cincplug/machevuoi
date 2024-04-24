interface IProps {
  handlePlayButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Splash: React.FC<IProps> = ({ handlePlayButtonClick }) => {
  return (
    <div className="wrap splash">
      <h1>
        <span className="text">Ma che vuoi?</span>
      </h1>
      <div className="slogan">
        <div className="slogan-text">
          <p>Paint with your hand, in the thin air</p>
          <p>Make sure there is enough light</p>
        </div>
      </div>
      <button className="splash-button" onClick={handlePlayButtonClick}>
        Start camera
      </button>
    </div>
  );
};

export default Splash;
