import { type ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { VscFilter } from 'react-icons/vsc';

import { InputCheckBoxThemed } from './forms/InputCheckBoxThemed';
import { Popover } from './Popover';

interface IFilters {
  name: string;
  type: string;
  formValue: string;
}

interface ITables {
  filters: IFilters[] | null;
  columns: string[];
  actions: string[];
  userCanView: boolean;
  name: string;
  icon: ReactNode;
  noDataImage: string;
}

interface IProjectTable {
  tables: ITables[];
  active: string;
}

export const DashBoardTable = ({ tables, active }: IProjectTable) => {
  const [selectedTable, setSelectedTable] = useState(0);

  const { register } = useForm();

  return (
    <div className="overflow-hidden rounded border-[3px] border-solid border-main">
      <div>
        {tables.map((table, tableIndex) => (
          <button
            type="button"
            className="flex max-w-max items-center justify-start gap-[16px] border-[1px] border-solid border-complement-100 p-[22px] text-complement-200"
            key={table.name}
            onClick={() => {
              setSelectedTable(tableIndex);
            }}
          >
            {table.icon} <p>{table.name}</p>
          </button>
        ))}
      </div>
      <div className="mb-[128px]">
        <div className="p-[32px]">
          <div className="flex items-center justify-between">
            <Popover
              triggerElement={
                <button
                  type="button"
                  className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100"
                >
                  <VscFilter size={20} /> Filtros <IoIosArrowDown size={20} />
                </button>
              }
            >
              <form>
                {tables[selectedTable]?.filters?.map((filter) => (
                  <InputCheckBoxThemed
                    register={register}
                    name={filter.formValue}
                    label={filter.name}
                    key={filter.name}
                  />
                ))}
              </form>
            </Popover>
            <button
              type="button"
              className="flex items-center gap-[16px] rounded bg-main px-[16px] py-[8px] text-[20px] text-complement-100"
            >
              Gerar Relatório <IoIosArrowDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
