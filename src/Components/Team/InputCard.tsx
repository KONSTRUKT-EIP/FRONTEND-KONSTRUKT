import React, { useState } from 'react'

interface InputCard {
  title: string;
  description: string;
  value?: number;
  onChange?: (value: number) => void;  // ← renommé
}

const InputCard: React.FC<InputCard> = ({ title, description, value, onChange }) => {
  const [hours, setHours] = useState(value);

  const HandleChange = (input: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(input.target.value);
    setHours(val);
    onChange?.(val);  // ← renommé
  }

  return (
    <div className='flex-1 bg-gray-100 grid rounded-2xl mx-4 p-7'>
      <span className='gap-2 py-2 mx-2'>{title}</span>
      <input
        type="number"
        value={hours}
        min={0}
        onChange={HandleChange}
        placeholder="0"
        className='bg-white border border-gray-300 rounded-2xl px-4 py-4 text-xl font-bold'
      />
      <span className='gap-2 py-2 mx-2'>{description}</span>
    </div>
  )
};

export default InputCard;