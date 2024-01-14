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
    label: `${serie}`,
    value: serie,
  }));

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="year"
      label={label || 'Ano Cursivo'}
      placeholder={placeholder || 'Ano Cursivo'}
      options={options}
      onChange={onChange}
      isClearable
    />
  );
};
