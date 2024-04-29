interface IProps {
  handlePlayButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Splash: React.FC<IProps> = ({ handlePlayButtonClick }) => {
  return (
    <div className="wrap splash">
      <section>
        <h1>
          <span className="text">Ma che vuoi?</span>
        </h1>
        <div className="slogan">
          <p className="slogan-text">
            Paint with your bare hand
            <br />
            in the thin air
          </p>
        </div>
      </section>
      <button className="splash-button" onClick={handlePlayButtonClick}>
        Start camera
      </button>
    </div>
  );
};

export default Splash;
