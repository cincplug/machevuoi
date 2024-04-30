interface IProps {
  handlePlayButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Splash: React.FC<IProps> = ({ handlePlayButtonClick }) => {
  return (
    <div className="wrap splash">
      <section>
        <h1>Ma che vuoi?</h1>
        <p className="slogan">
          Paint with your bare hand
          <br />
          in the thin air
        </p>
      </section>
      <button className="splash-button" onClick={handlePlayButtonClick}>
        Start camera
      </button>
    </div>
  );
};

export default Splash;
