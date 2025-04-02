import React from 'react';
import { NumericFormat } from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      isNumericString
    />
  );
}

export default NumberFormatCustom;
