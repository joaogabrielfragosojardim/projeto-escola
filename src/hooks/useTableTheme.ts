import { getTheme } from '@table-library/react-table-library/baseline';
import { useTheme } from '@table-library/react-table-library/theme';

export const useTableTheme = () => {
  const padding = 32;
  const theme = useTheme([
    getTheme(),
    {
      HeaderCell: `
        font-weight: normal;
        font-size: 20px;
        border: none;
        
        &:first-of-type{
          padding-left: ${padding}px;
        }
        &:last-of-type{
          padding-right: ${padding}px;
        }
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
      Cell: `
      padding-bottom: 12px;
      padding-top: 12px;

      &:first-of-type{
        padding-left: ${padding}px;
      }
      &:last-of-type{
        padding-right: ${padding}px;
      }

      > div{
        white-space: normal;
      }
      `,
    },
  ]);

  return theme;
};
