import { getTheme } from '@table-library/react-table-library/baseline';
import { useTheme } from '@table-library/react-table-library/theme';

export const useTableTheme = () => {
  const theme = useTheme([
    getTheme(),
    {
      HeaderCell:`
        font-weight: normal;
        font-size: 20px;
        border: none
      `,
      HeaderRow: `
        background-color: transparent;
        font-size: 20px;
        color: #5C6189;
      `,
      Row: `
      :not(:last-of-type) > .td {
        border-bottom: 1px solid #D9D9D9;
      }
    `,
    },
  ]);

  return theme;
};
