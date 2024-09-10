import React, { createContext, useContext, ReactNode } from 'react';

interface ToggleGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextType | undefined>(
  undefined
);

interface ToggleGroupProps {
  children: ReactNode;
  type: 'single';
  value: string;
  onValueChange: (value: string) => void;
}

export function ToggleGroup({
  children,
  value,
  onValueChange,
}: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

interface ToggleGroupItemProps {
  value: string;
  children: ReactNode;
}

export function ToggleGroupItem({ value, children }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup');
  }

  const { value: groupValue, onValueChange } = context;
  const isActive = groupValue === value;

  return (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium border ${
        isActive
          ? 'bg-blue-700 text-white hover:bg-blue-800'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      } focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700`}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}
