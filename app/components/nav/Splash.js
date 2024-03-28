const Splash = (props) => {
  const { handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <h1>Pecel</h1>
      <button
        className="splash-button"
        title="Start the app"
        onClick={handlePlayButtonClick}
      >
        Start camera
      </button>
    </div>
  );
};

export default Splash;
