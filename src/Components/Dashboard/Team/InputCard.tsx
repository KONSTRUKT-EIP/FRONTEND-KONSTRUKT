import React from 'react'

interface InputCard {
  title: string;
  description: string;
  value?: number | '';
  onChange?: (value: number | '') => void;
}

const InputCard: React.FC<InputCard> = ({ title, description, value, onChange }) => {
  const handleChange = (input: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = input.target.value;
    onChange?.(rawValue === '' ? '' : Number(rawValue));
  }

  return (
    <div className='flex-1 bg-gray-100 grid rounded-2xl mx-4 p-7'>
      <span className='gap-2 py-2 mx-2'>{title}</span>
      <input
        type="number"
        value={value ?? ''}
        min={0}
        onChange={handleChange}
        placeholder="0"
        className='bg-white border border-gray-300 rounded-2xl px-4 py-4 text-xl font-bold placeholder:text-gray-400'
      />
      <span className='gap-2 py-2 mx-2'>{description}</span>
    </div>
  )
};

export default InputCard;