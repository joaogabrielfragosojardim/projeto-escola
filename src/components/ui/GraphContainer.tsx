import { type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface ITabs {
  userCanView: boolean;
  name: string;
  icon: ReactNode;
  tab: ReactNode;
}

interface IDashboardTable {
  tabs: ITabs[];
  selectedTab: number;
  setSelectedTab: Dispatch<SetStateAction<number>>;
}

export const GraphContainer = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: IDashboardTable) => {
  const filteredTables = tabs.filter((tab) => tab.userCanView);

  return (
    <div>
      <div className="overflow-hidden border-main 2xl:rounded 2xl:border-[3px] 2xl:border-solid">
        <div className="hidden w-full 2xl:flex">
          {filteredTables.map((tab, tabIndex) => (
            <button
              type="button"
              className={`flex flex-auto items-center justify-center gap-[16px] border-[1px] border-solid border-complement-100 p-[22px] text-complement-200 ${
                tabIndex === selectedTab
                  ? 'border-b-[3px] border-solid border-b-main'
                  : ''
              }`}
              key={tab.name}
              onClick={() => {
                setSelectedTab(tabIndex);
              }}
            >
              {tab.icon} <p>{tab.name}</p>
            </button>
          ))}
        </div>
        <div className="flex w-full gap-[8px] overflow-auto 2xl:hidden">
          {filteredTables.map((table, tableIndex) => (
            <div key={table.name}>
              <button
                type="button"
                className={`flex min-w-max items-center justify-center gap-[8px] rounded px-[16px] py-[8px] text-[12px] ${
                  tableIndex === selectedTab
                    ? 'bg-main text-complement-100'
                    : 'bg-complement-100 text-complement-200'
                }`}
                key={table.name}
                onClick={() => {
                  setSelectedTab(tableIndex);
                }}
              >
                {table.icon} <p>{table.name}</p>
              </button>
            </div>
          ))}
        </div>
        <div>{filteredTables[selectedTab]?.tab}</div>
      </div>
    </div>
  );
};
