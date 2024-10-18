import React, {useEffect} from 'react';
import {LocalConfigContext} from './local-config-context';
import {Theme} from "../theme/theme-context.tsx";

const themeKey = 'theme';

export const LocalConfigProvider: React.FC<React.PropsWithChildren> = ({children,}) => {
  const [theme, setTheme] = React.useState<Theme>(
    (localStorage.getItem(themeKey) as Theme) || 'system'
  );
  useEffect(() => {
    localStorage.setItem(themeKey, theme);
  }, [theme]);

  return (
    <LocalConfigContext.Provider
      value={{
        theme,
        setTheme
      }}
    >
      {children}
    </LocalConfigContext.Provider>
  );
};
