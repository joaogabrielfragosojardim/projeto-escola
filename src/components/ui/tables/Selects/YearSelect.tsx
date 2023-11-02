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

  const options = allSeries.map((serie) => ({
    label: `${serie}º ano`,
    value: serie,
  }));

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="year"
      label={label || 'Ano'}
      placeholder={placeholder || 'Ano'}
      options={options}
      onChange={onChange}
      isClearable
    />
  );
};
