// import { ReactComponent as Logo } from "../../assets/img/lukonica-logo.svg";

const Splash = (props) => {
  const { setIsEditing, handlePlayButtonClick } = props;
  return (
    <div className="wrap splash">
      <h1>Pecel</h1>
      <button className="splash-button" title="Start the app" onClick={handlePlayButtonClick}>
        {/* <Logo /> */}
        Start camera
      </button>
      <div className="buttons">
        <button
          className="splash-button"
          title="Edit selected face mask"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit mask
        </button>
      </div>
    </div>
  );
};

export default Splash;
