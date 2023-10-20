import type { ColumnResizeProps } from '@table-library/react-table-library/types/resize';
import type { ColumnSelectProps } from '@table-library/react-table-library/types/select';
import type { ColumnSortProps } from '@table-library/react-table-library/types/sort';
import type { TableNode } from '@table-library/react-table-library/types/table';
import type { ColumnTreeProps } from '@table-library/react-table-library/types/tree';

export type Column<T extends TableNode> = {
  label: string;
  renderCell: (node: T) => React.ReactNode;
  footer?: string;
  resize?: ColumnResizeProps;
  sort?: ColumnSortProps;
  select?: ColumnSelectProps;
  tree?: ColumnTreeProps<T>;
  pinLeft?: boolean;
  pinRight?: boolean;
  hide?: boolean;
  cellProps?: Record<string, any>;
};
