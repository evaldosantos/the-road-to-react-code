import React from 'react';

const InputWithLabel = ({
  id,
  children,
  value,
  type = 'text',
  onInputChange,
  isFocused
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if ( isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
        &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
}

export default InputWithLabel;