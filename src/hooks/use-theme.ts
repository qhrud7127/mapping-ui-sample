import {useContext} from 'react';
import {ThemeContext} from "../context/theme/theme-context.tsx";

export const useTheme = () => useContext(ThemeContext);
