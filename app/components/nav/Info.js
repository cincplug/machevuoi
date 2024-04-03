const Info = (props) => {
  const { setup } = props;
  const { pattern, isScratchCanvas } = setup;
  return (
    <div className="info">
      <>
        {["paths", "hose", "kite", "canvas"].includes(pattern) &&
          !isScratchCanvas && (
            <>
              <p>Pinch thumb and forefinger 👌 to draw</p>
              <p>Release the pinch to stop drawing</p>
              <p>Wag your forefinger 👆 to delete</p>
              {pattern !== "canvas" && (
                <p>Add text along the path if you want</p>
              )}
            </>
          )}
        {isScratchCanvas && (
          <>
            <p>Hold <strong>Shift</strong> to draw</p>
            <p>Choose finger points that draw</p>
            <p>Use pinch to scale the brush</p>
            <p>Wag forefinger 👆 to delete</p>
            <p>Use dispersion and dash for feeling</p>
          </>
        )}
      </>
    </div>
  );
};

export default Info;
