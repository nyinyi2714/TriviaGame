import { createContext, useContext, useState, ReactNode } from 'react';

type States = {
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
};

const StateContext = createContext<States | undefined>(undefined);

interface StateProviderProps {
  children: ReactNode;
}

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
}

export function StateProvider({ children }: StateProviderProps) {
  const [startDate, setStartDate] = useState(new Date());

  const states: States = {
    startDate,
    setStartDate,
  };

  return (
    <StateContext.Provider value={states}>
      {children}
    </StateContext.Provider>
  );
}
