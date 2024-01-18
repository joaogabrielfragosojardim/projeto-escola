import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { SelectThemed } from '../forms/SelectThemed';

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
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  perPage: number;
}

export const DashBoardTable = ({
  tables,
  selectedTable,
  setSelectedTable,
  page,
  setPage,
  totalPages,
  setPerPage,
  perPage,
}: IDashboardTable) => {
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const filteredTables = tables.filter((table) => table.userCanView);
  const slicedPagesArray = pagesArray.slice(0, 5);
  const slicedPagesArrayMobile = pagesArray.slice(0, 3);

  const { control, reset } = useForm();

  return (
    <div>
      <div className="overflow-hidden border-main 2xl:rounded 2xl:border-[3px] 2xl:border-solid">
        <div className="hidden w-full 2xl:flex">
          {filteredTables.map((table, tableIndex) => (
            <button
              type="button"
              className={`flex flex-auto items-center justify-center gap-[16px] border-[1px] border-solid border-complement-100 p-[22px] text-complement-200 ${
                tableIndex === selectedTable
                  ? 'border-b-[3px] border-solid border-b-main'
                  : ''
              }`}
              key={table.name}
              onClick={() => {
                setPage(1);
                setSelectedTable(tableIndex);
              }}
            >
              {table.icon} <p>{table.name}</p>
            </button>
          ))}
        </div>
        <div className="flex w-full gap-[8px] overflow-auto 2xl:hidden">
          {filteredTables.map((table, tableIndex) => (
            <div key={table.name}>
              <button
                type="button"
                className={`flex min-w-max items-center justify-center gap-[8px] rounded px-[16px] py-[8px] text-[12px] ${
                  tableIndex === selectedTable
                    ? 'bg-main text-complement-100'
                    : 'bg-complement-100 text-complement-200'
                }`}
                key={table.name}
                onClick={() => {
                  setPage(1);
                  setSelectedTable(tableIndex);
                }}
              >
                {table.icon} <p>{table.name}</p>
              </button>
            </div>
          ))}
        </div>
        <div>{filteredTables[selectedTable]?.table}</div>
      </div>
      {totalPages > 1 ? (
        <>
          <div className="mt-[24px] flex w-full justify-between">
            <button
              type="button"
              className="hidden rounded bg-complement-100 px-[16px] py-[8px] text-[16px] text-complement-200 disabled:opacity-60 2xl:inline"
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
              disabled={page === 1}
            >
              Anterior
            </button>
            <div className="flex gap-[16px]">
              <div className="hidden gap-[16px] 2xl:flex">
                {slicedPagesArray.map((pageArray) => (
                  <button
                    key={pageArray}
                    type="button"
                    className={`${
                      page === pageArray
                        ? 'bg-main text-complement-100'
                        : 'bg-complement-100 text-complement-200'
                    } rounded px-[16px] py-[8px] text-[16px]`}
                    onClick={() => {
                      setPage(pageArray);
                    }}
                  >
                    {pageArray}
                  </button>
                ))}
              </div>
              <div className="flex gap-[16px] 2xl:hidden">
                {slicedPagesArrayMobile.map((pageArray) => (
                  <button
                    key={pageArray}
                    type="button"
                    className={`${
                      page === pageArray
                        ? 'bg-main text-complement-100'
                        : 'bg-complement-100 text-complement-200'
                    } rounded px-[16px] py-[8px] text-[16px]`}
                    onClick={() => {
                      setPage(pageArray);
                    }}
                  >
                    {pageArray}
                  </button>
                ))}
              </div>
              {pagesArray.length > 5 ? (
                <>
                  <div className="hidden gap-4 2xl:flex">
                    {!slicedPagesArray.includes(page) && page !== totalPages ? (
                      <div className="rounded bg-main px-[16px] py-[8px] text-[16px] text-complement-100">
                        {page}
                      </div>
                    ) : (
                      <div className="rounded bg-complement-100 px-[16px] py-[8px] text-[16px] text-complement-200">
                        ...
                      </div>
                    )}
                    <button
                      type="button"
                      className={`${
                        page === totalPages
                          ? 'bg-main text-complement-100'
                          : 'bg-complement-100 text-complement-200'
                      } rounded px-[16px] py-[8px] text-[16px]`}
                      onClick={() => {
                        setPage(totalPages);
                      }}
                    >
                      {totalPages}
                    </button>
                  </div>
                  <div className="flex gap-4 2xl:hidden">
                    {!slicedPagesArrayMobile.includes(page) &&
                    page !== totalPages ? (
                      <div className="rounded bg-main px-[16px] py-[8px] text-[16px] text-complement-100">
                        {page}
                      </div>
                    ) : (
                      <div className="rounded bg-complement-100 px-[16px] py-[8px] text-[16px] text-complement-200">
                        ...
                      </div>
                    )}
                    <button
                      type="button"
                      className={`${
                        page === totalPages
                          ? 'bg-main text-complement-100'
                          : 'bg-complement-100 text-complement-200'
                      } rounded px-[16px] py-[8px] text-[16px]`}
                      onClick={() => {
                        setPage(totalPages);
                      }}
                    >
                      {totalPages}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex gap-[16px]">
              <div>
                <SelectThemed
                  control={control}
                  reset={reset}
                  name="perPageSelect"
                  placeholder="quantidade"
                  menuPlacement="top"
                  options={[
                    { label: '10', value: '10' },
                    { label: '30', value: '30' },
                    { label: '50', value: '50' },
                    { label: 'Total', value: `${totalPages * perPage}` },
                  ]}
                  onChange={(e: any) => {
                    setPage(1);
                    setPerPage(parseInt(e.value, 10));
                  }}
                />
              </div>
              <button
                type="button"
                className="hidden rounded bg-main px-[16px] py-[8px] text-[16px] text-complement-100 disabled:opacity-60 2xl:inline"
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          </div>
          <div className="mt-[24px] flex w-full justify-between 2xl:hidden">
            <button
              type="button"
              className="rounded bg-complement-100 px-[16px] py-[8px] text-[16px] text-complement-200 disabled:opacity-60"
              onClick={() => {
                setPage((prev) => prev - 1);
              }}
              disabled={page === 1}
            >
              <IoIosArrowBack />
            </button>
            <div className="flex gap-[16px]" />
            <div className="flex max-w-[120px]  gap-[16px] 2xl:max-w-[180px]">
              <button
                type="button"
                className="rounded bg-main px-[16px] py-[8px] text-[16px] text-complement-100 disabled:opacity-60"
                onClick={() => {
                  setPage((prev) => prev + 1);
                }}
                disabled={page === totalPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="ml-auto mt-[32px] max-w-[120px] 2xl:max-w-[180px]">
          <SelectThemed
            control={control}
            reset={reset}
            name="perPageSelect"
            placeholder="quantidade"
            menuPlacement="top"
            isClearable={false}
            options={[
              { label: '10', value: '10' },
              { label: '30', value: '30' },
              { label: '50', value: '50' },
              { label: 'Total', value: `${totalPages * perPage}` },
            ]}
            onChange={(e: any) => {
              setPerPage(parseInt(e?.value, 10));
            }}
          />
        </div>
      )}
    </div>
  );
};
