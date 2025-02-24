import { useState, useEffect } from 'react';

const Input = ({ type, id, label, className, autoComplete, value = '', onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        className={className}
        autoComplete={autoComplete}
        value={inputValue}
        onChange={handleChange}
        name={type}
      />
      <label
        htmlFor={id}
        className="text-gray-1 peer-focus:text-gray-1 absolute -top-4 left-0 cursor-text text-[10.2px] leading-none transition-all peer-focus:-top-4 peer-focus:text-xs dark:text-white-200 dark:peer-focus:text-white md:text-[20px] tablet:text-[18px] short:text-[14px]"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
