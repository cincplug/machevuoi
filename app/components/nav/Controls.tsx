import { ISetup, IControl, UpdateSetupType } from "../../../types";

interface IProps {
  setup: ISetup;
  controls: IControl[];
  updateSetup: (event: UpdateSetupType) => void;
}

const Controls: React.FC<IProps> = ({ controls, setup, updateSetup }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = event.target;
    updateSetup({ id, value, type });
  };
  const handleOptionButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const target = event.target as HTMLButtonElement;
    const { id, value } = target;
    updateSetup({ id, value, type: "select" });
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;
    updateSetup({ id, value, type: "select" });
  };

  return controls.map((item, index) => {
    const { id, type, min, max, step, title, description, options, isButtons } =
      item;
    let value = setup[id];
    const checked = value === true;

    const defaultValue =
      type === "color" ? "#000000" : type === "range" ? 0 : "";

    const inputProps = {
      type,
      id,
      min,
      max,
      step,
      value: value || defaultValue,
      ...(type === "checkbox" && { checked }),
      onChange: handleInputChange
    };

    if (type === "checkbox") {
      inputProps.checked = checked;
    }

    if (isButtons)
      return (
        <fieldset className="icon-buttons-wrap" key={`${id}-${index}`}>
          {options.map((option: string, optionIndex: number) => (
            <button
              className={`icon-button ${option} ${
                value === option ? "active" : ""
              }`}
              title={`Add ${option}`}
              aria-label={option}
              key={optionIndex}
              id={id}
              value={option}
              onClick={handleOptionButtonClick}
            ></button>
          ))}
        </fieldset>
      );

    return (
      <div
        className={`control ${type} control-${id}`}
        key={`${id}-${index}`}
        title={description}
      >
        {type === "select" ? (
          <select {...{ value, id }} onChange={handleSelectChange}>
            {options.map((option: string, optionIndex: number) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input {...inputProps} />
        )}
        <label htmlFor={id}>
          <span className="text">{title}</span>
          {type === "range" && <span className="value">{value}</span>}
        </label>
      </div>
    );
  });
};

export default Controls;
