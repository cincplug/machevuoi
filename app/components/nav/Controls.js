const Controls = ({ controls, setup, handleInputChange }) =>
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
              title={option}
              key={optionIndex}
              onClick={() =>
                handleInputChange({ target: { value: option, id } })
              }
            >
              {option}
            </button>
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
