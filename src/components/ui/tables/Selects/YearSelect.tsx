import { useForm } from 'react-hook-form';

import { allSeries } from '@/constants/classroom';

import { SelectThemed } from '../../forms/SelectThemed';

export const YearSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  // const fetchSchoolOptions = async () => {
  //   return axiosApi.get('/school/options');
  // };

  // const { data, isLoading } = useQuery(
  //   'fetchSchoolOptionsTable',
  //   fetchSchoolOptions,
  // );

  // if (isLoading) {
  //   return (
  //     <div className="flex h-[42px] w-full items-center justify-center rounded border-[1px] border-solid border-main">
  //       <div className="w-[24px] animate-spin">
  //         <TbLoader size={24} />
  //       </div>
  //     </div>
  //   );
  // }
  const options = allSeries.map((serie) => ({
    label: `${serie}º ano`,
    value: serie,
  }));

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="year"
      label={label || 'Série'}
      placeholder={placeholder || 'Série'}
      options={options}
      onChange={onChange}
      isClearable
    />
  );
};
