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
            Paint with bare hand
            <br />
            in the thin air
          </p>
        </div>
      </section>
      <button className="splash-button" onClick={handlePlayButtonClick}>
        Start camera
      </button>
      <section className="pro-tips">
        <p>For best results, ensure good light</p>
        <ul>
          <li>pinch your fingers to draw 🤌 (ma che vuoi?)</li>
          <li>or hold <strong>Shift</strong> while you draw</li>
          <li>or turn on <strong>Caps Lock</strong> before you start drawing</li>
        </ul>
        <p>Wag your forefinger 👆 (basta) to erase your drawing</p>
      </section>
    </div>
  );
};

export default Splash;
