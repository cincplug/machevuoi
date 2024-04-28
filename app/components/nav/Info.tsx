import { ISetup } from "../../../types";

interface IProps {
  setup: ISetup;
}

const Info: React.FC<IProps> = ({ setup }) => {
  const { pattern, isScratchCanvas } = setup;
  return (
    <div className="info">
      {pattern !== "canvas" || !isScratchCanvas ? (
        <p>Use thumb and forefinger to draw 👌 </p>
      ) : (
        <p>Use whole hand to draw 🖐️🤘🫱✌️</p>
      )}{" "}
      {pattern === "canvas" ? (
        <>
          <p>Grip affects line width</p>
          <p>You can use both of your hands</p>
        </>
      ) : (
        <>
          <p>Grip does not affect line width.</p>
          <p> Only one hand can draw. </p>
          <p>You can add text</p>
        </>
      )}
    </div>
  );
};

export default Info;
