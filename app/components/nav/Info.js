const Info = (props) => {
  const { setup } = props;
  const { showsFaces, pattern, isScratchCanvas } = setup;
  return (
    <div className="info">
      {showsFaces && (
        <>
          <p>Face detection is ON.</p>
          {pattern === "paths" && (
            <>
              <p>Select masks to change face points</p>
            </>
          )}
          {pattern === "images" && (
            <>
              <p>Select masks to change face points</p>
              <p>Use image URL for different image</p>
            </>
          )}
        </>
      )}
      {!showsFaces && (
        <>
          <p>
            Face detection is OFF
          </p>
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
              <p>Hold space bar to draw</p>
              <p>Choose finger points that draw</p>
              <p>Use pinch to scale the "brush"</p>
              <p>Wag forefinger 👆 to delete</p>
              <p>Use dispersion and dash for feeling</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Info;
