import { ISetup } from "../../../types";

interface IControl {
  id: string;
  type: string;
  min: number;
  max: number;
  step: string;
  title: string;
  description: string;
  options: string[];
  isButtons: boolean;
}

interface IProps {
  setup: ISetup;
  controls: IControl[];
  handleInputChange: (event: object) => void;
}

const Controls: React.FC<IProps> = ({ controls, setup, handleInputChange }) =>
  controls.map((item, index) => {
    const { id, type, min, max, step, title, description, options, isButtons } =
      item;
    let value = setup[id];
    const checked = value === true;

    const defaultValue =
      type === "color" ? "#000000" : type === "range" ? 0 : "";

    const inputProps = {
      className: "control__input",
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
          {options.map((option, optionIndex) => (
            <button
              className={`icon-button ${option} ${
                value === option ? "active" : ""
              }`}
              title={`Add ${option}`}
              aria-label={option}
              key={optionIndex}
              onClick={() =>
                handleInputChange({ target: { value: option, id } })
              }
            ></button>
          ))}
        </fieldset>
      );

    return (
      <div
        className={`control control--${type} control--${id}`}
        key={`${id}-${index}`}
        title={description}
      >
        {type === "select" ? (
          <select
            className="control__select"
            {...{ value, id }}
            onChange={handleInputChange}
          >
            {options.map((option, optionIndex) => (
              <option key={optionIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input {...inputProps} />
        )}
        <label className="control__label" htmlFor={id}>
          <span className="text">{title}</span>
          {type === "range" && <span className="value">{value}</span>}
        </label>
      </div>
    );
  });

export default Controls;
