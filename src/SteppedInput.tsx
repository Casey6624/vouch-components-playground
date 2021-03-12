import React, { useState, useEffect, createRef } from "react";
import styled from "styled-components";

interface Props {
  disallowPaste?: boolean;
  label: string;
  isDate?: boolean;
  config: Config[];
  values: Array<any>;
  onError?: Function;
  onChange: Function;
  divider?: string;
  onFormattedChange?: Function;
}

interface Config {
  label?: string;
  length: number;
  minVal?: number;
  maxVal?: number;
}

const TextInputContainer = styled.div<{ focused: boolean }>`
  margin: 10px 0;
  border-style: solid;
  border-color: rgba(188, 190, 192, 0.5);
  border-width: 1px;
  padding: 18px;
  border-radius: 5px;
  position: relative;
  text-align: left;
  cursor: text;
  border-color: ${(props: any) => (props.focused ? "#34bebd" : "")};
`;

const TextInputElement = styled.input`
  outline: none;
  border: none;
  background: none;
  width: 100%;
  text-align: center;
`;

const TextInputLabel = styled.span<{ focused: boolean }>`
  position: absolute;
  color: ${(props) => (props.focused ? "#34bebd" : "#bcbec0")};
  transform: ${(props) =>
    props.focused ? "translateY(-29px) scale(0.71)" : ""};
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  cursor: text;
  white-space: nowrap;
  text-align: center;
  font-size: 14px;
  background: ${(props) => (props.focused ? "white" : "transparent")};
  padding: 2px 8px;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
`;

const Divider = styled.span`
  font-weight: bold;
  text-align: center;
`;

const SteppedInput: React.FC<Props> = ({
  label,
  onChange,
  values,
  onFormattedChange,
  config,
  onError,
  isDate,
  disallowPaste = false,
  divider = "-",
}) => {
  const [focused, setFocused] = useState(false);
  const [elementRefs, setElementRefs] = useState<any[]>([]);

  function handleBlur(index: number) {
    if (elementRefs[index].current.value.trim() === "") {
      setFocused(false);
    } else {
      setFocused(true);
    }
  }

  useEffect(() => {
    if (!onError) return;
    const errors: string[] = [];
    config.forEach(({ maxVal, minVal, label }, index) => {
      const segmentVal = +values[index];
      if (maxVal && segmentVal > maxVal) {
        errors.push(
          `${!label ? "Segment" : ""} ${label || index + 1} is too large`
        );
      }

      if (minVal && segmentVal < minVal) {
        errors.push(
          `${!label ? "Segment" : ""} ${label || index + 1} is too small`
        );
      }
    });

    if (isDate && isNaN(Date.parse(values.join("-"))) === true) {
      errors.push("Date is invalid");
    }
    onError([...errors]);
  }, [values, isDate]);

  function handleFocus(index: number) {
    elementRefs[index].current.focus();
    setFocused(true);
  }

  function isBackSpace(e: any, index: number) {
    if (e.key === "Backspace") {
      handleChange(e, index);
    }
  }

  function handlePaste(e: any) {
    if (disallowPaste) return;
    const clipboardChunks = e.clipboardData.getData("Text").split("");
    const newVals: string[] = [];
    let currPos = 0;

    config.forEach(({ length }, index) => {
      if (currPos + length <= clipboardChunks.length) {
        newVals[index] = clipboardChunks
          .slice(currPos, currPos + length)
          .join("");
        currPos += length;
      }
    });
    onChange(newVals);
  }

  function handleChange(e: any, index: number) {
    const { value } = e.target;
    const currVals = [...values];
    currVals[index] = value;

    // focus next input if current textbox is full
    if (value.length === config[index].length && index !== config.length - 1) {
      elementRefs[index + 1].current.focus();
    }
    // handle backspace if current textbox is empty
    if (
      value.length === 0 &&
      currVals[index].length === 0 &&
      index !== 0 &&
      e.key === "Backspace"
    ) {
      elementRefs[index - 1].current.focus();
    }
    onChange(currVals);
    if (onFormattedChange) {
      onFormattedChange(currVals.join(divider));
    }
  }

  // create an array of refs which we can use to focus
  useEffect(() => {
    setElementRefs((elRefs: any) =>
      Array(config.length)
        .fill(Array(config.length))
        .map((_, i) => elRefs[i] || createRef())
    );
    if (values.length !== config.length && onError) {
      onError([`${label} is not complete`]);
    }
  }, [config.length]);

  return (
    <TextInputContainer
      focused={focused}
      onFocus={(e: any) => {
        e.stopPropagation();
      }}
      onClick={(e: any) => {
        e.stopPropagation();
      }}
      onBlur={() => handleBlur(0)}
    >
      <TextInputLabel
        focused={focused}
        id="text-input"
        onFocus={() => handleFocus(0)}
        onClick={() => handleFocus(0)}
        onBlur={() => handleBlur(0)}
      >
        {label}
      </TextInputLabel>
      <InputContainer>
        {config.map((conf: Config, index: number) => (
          <>
            <TextInputElement
              type="text"
              name={`element-${index}`}
              ref={elementRefs[index]}
              onClick={() => handleFocus(index)}
              onBlur={() => handleBlur(index)}
              onPaste={(e) => handlePaste(e)}
              onChange={(e) => handleChange(e, index)}
              onFocus={() => handleFocus(index)}
              tabIndex={index + 1}
              maxLength={conf.length}
              onKeyDown={(e) => isBackSpace(e, index)}
            />
            {index !== config.length - 1 && <Divider>{divider}</Divider>}
          </>
        ))}
      </InputContainer>
    </TextInputContainer>
  );
};

export default SteppedInput;
