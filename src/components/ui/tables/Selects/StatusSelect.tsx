import { useForm } from 'react-hook-form';

import { SelectThemed } from '../../forms/SelectThemed';

export const StatusSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="project"
      label={label || 'Status'}
      placeholder={placeholder || 'Status'}
      options={[
        { label: 'Ativo', value: true },
        { label: 'Inativo', value: false },
      ]}
      onChange={onChange}
    />
  );
};
