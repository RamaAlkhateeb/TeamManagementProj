import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) return null;
    return React.cloneElement(child, { value, setValue });
  });
};

export const TabsList = ({ children }) => (
  <div className="flex gap-4 justify-center">{children}</div>
);

export const TabsTrigger = ({ children, value: tabValue, value, setValue }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium ${
      value === tabValue ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
    }`}
    onClick={() => setValue(tabValue)}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value: tabValue, value }) => {
  return tabValue === value ? <div>{children}</div> : null;
};