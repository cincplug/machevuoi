import { ISetup } from "../../../types";

interface IProps {
  setup: ISetup;
}

const Info: React.FC<IProps> = ({ setup }) => {
  const { output, isScratchCanvas } = setup;
  return (
    <div className="info">
      {output !== "canvas" || !isScratchCanvas ? (
        <p>Use thumb and forefinger to draw 👌 </p>
      ) : (
        <p>Use whole hand to draw 🖐️🤘🫱✌️</p>
      )}{" "}
      {output === "canvas" ? (
        <>
          <p>Grip affects line width depending on dynamics</p>
        </>
      ) : (
        <>
          <p>Grip doesn&apos;t affect line width</p>
          <p>You can add text</p>
        </>
      )}
    </div>
  );
};

export default Info;
