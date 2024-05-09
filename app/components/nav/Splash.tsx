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
      <section className="links">
        <a href="https://github.com/cincplug/machevuoi" target="_blank" rel="noopener noreferrer">GitHub repo</a>
        <a href="https://www.youtube.com/watch?v=XA_kYc5ovHI&ab_channel=Luka%C4%8Cin%C4%8DStanisavljevi%C4%87" target="_blank" rel="noopener noreferrer">YouTube demo</a>
      </section>
    </div>
  );
};

export default Splash;
