import { useForm } from 'react-hook-form';

import { allPeriods } from '@/constants/classroom';

import { SelectThemed } from '../../forms/SelectThemed';

export const PeriodSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const options = allPeriods.map((period) => ({
    label: period,
    value: period,
  }));

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="period"
      label={label || 'Período'}
      placeholder={placeholder || 'Período'}
      options={options}
      onChange={onChange}
      isClearable
    />
  );
};
