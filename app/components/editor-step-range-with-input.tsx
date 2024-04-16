/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faRandom } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CS_randomFloat, CS_randomInt } from "@ianlucas/cs2-lib";
import { useState } from "react";
import { useAppContext } from "./app-context";
import { EditorInput } from "./editor-input";
import { EditorStepRange } from "./editor-step-range";

export function EditorStepRangeWithInput({
  inputStyles,
  max,
  maxLength,
  min,
  onChange,
  randomizable,
  step,
  stepRangeStyles,
  transform,
  type,
  validate,
  value
}: {
  inputStyles: string;
  max: number;
  maxLength: number;
  min: number;
  onChange: (value: number) => void;
  randomizable?: boolean;
  step: number;
  stepRangeStyles: string;
  transform?: (value: number) => string;
  type: "int" | "float";
  validate: (value: number) => boolean;
  value: number;
}) {
  transform = transform !== undefined ? transform : String;
  const [text, setText] = useState(transform(value));
  const {
    translations: { translate }
  } = useAppContext();

  function handleTextChange({
    target: { value: text }
  }: React.ChangeEvent<HTMLInputElement>) {
    setText(text);
    const value = Number(text);
    if (text && validate(value)) {
      onChange(value);
    }
  }

  function handleTextBlur() {
    if (!text || !validate(Number(text))) {
      setText(transform!(value));
    }
  }

  function handleChange(value: number) {
    onChange(value);
    setText(transform!(value));
  }

  function handleRandomClick() {
    const value =
      type === "int" ? CS_randomInt(min, max) : CS_randomFloat(min, max);
    handleChange(Number(transform!(value)));
  }

  return (
    <>
      <EditorInput
        inflexible
        unstyled
        className={inputStyles}
        maxLength={maxLength}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        validate={(wearText) => validate(Number(wearText))}
        value={text}
      />
      <EditorStepRange
        className={stepRangeStyles}
        value={value}
        onChange={handleChange}
        max={max}
        min={min}
        step={step}
      />
      {randomizable !== undefined && (
        <button
          onClick={handleRandomClick}
          title={translate("EditorRandom")}
          className="flex cursor-default items-center rounded border border-neutral-600 p-1 text-neutral-400 transition-all hover:border-neutral-200 hover:text-neutral-200"
        >
          <FontAwesomeIcon className="h-3" icon={faRandom} />
        </button>
      )}
    </>
  );
}
