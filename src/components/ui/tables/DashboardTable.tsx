import { type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface ITables {
  userCanView: boolean;
  name: string;
  icon: ReactNode;
  table: ReactNode;
}

interface IDashboardTable {
  tables: ITables[];
  selectedTable: number;
  setSelectedTable: Dispatch<SetStateAction<number>>;
}

export const DashBoardTable = ({
  tables,
  selectedTable,
  setSelectedTable,
}: IDashboardTable) => {
  return (
    <div className="overflow-hidden rounded border-[3px] border-solid border-main">
      <div className="flex w-full">
        {tables.map((table, tableIndex) => (
          <button
            type="button"
            className={`flex flex-auto items-center justify-center gap-[16px] border-[1px] border-solid border-complement-100 p-[22px] text-complement-200 ${
              tableIndex === selectedTable
                ? 'border-b-[3px] border-solid border-b-main'
                : ''
            }`}
            key={table.name}
            onClick={() => {
              setSelectedTable(tableIndex);
            }}
          >
            {table.icon} <p>{table.name}</p>
          </button>
        ))}
      </div>
      <div>{tables[selectedTable]?.table}</div>
    </div>
  );
};
