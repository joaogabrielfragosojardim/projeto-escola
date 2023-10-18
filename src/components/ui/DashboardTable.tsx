import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowDown } from 'react-icons/io';
import { VscFilter } from 'react-icons/vsc';

import { InputCheckBoxThemed } from './forms/InputCheckBoxThemed';
import { InputThemed } from './forms/InputThemed';
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
  selectedTable: number;
  setSelectedTable: Dispatch<SetStateAction<number>>;
}

export const DashBoardTable = ({
  tables,
  selectedTable,
  setSelectedTable,
}: IProjectTable) => {
  const [filters, setFilters] = useState<IFilters[]>([]);

  const { register, control, reset } = useForm();

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
              setFilters([]);
            }}
          >
            {table.icon} <p>{table.name}</p>
          </button>
        ))}
      </div>
      <div>
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
                    validations={{
                      onChange(event) {
                        if (event.target.checked) {
                          return setFilters([
                            ...filters,
                            {
                              name: filter.name,
                              type: filter.type,
                              formValue: filter.formValue,
                            },
                          ]);
                        }
                        const copyFilters = [...filters];
                        const id = copyFilters.indexOf({
                          name: filter.name,
                          type: filter.type,
                          formValue: filter.formValue,
                        });
                        copyFilters.splice(id);
                        setFilters(copyFilters);
                      },
                    }}
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
          <div className="mt-[32px] grid grid-cols-2">
            {filters.map((filter) => (
              <div key={filter.formValue}>
                {filter.type === 'string' ? (
                  <InputThemed
                    label={filter.name}
                    register={register}
                    name={`${filter.formValue}Filter`}
                  />
                ) : (
                  // <SelectThemed
                  //   control={control}
                  //   name={`${filter.formValue}Filter`}
                  //   reset={reset}
                  // />
                  <div>rever options do select</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
