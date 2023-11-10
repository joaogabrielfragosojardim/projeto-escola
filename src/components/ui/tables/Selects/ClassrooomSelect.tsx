import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const ClassRoomSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const fetchClassOptions = async () => {
    return axiosApi.get('/class/options');
  };

  const { data, isLoading } = useQuery('fetchClassOptions', fetchClassOptions);

  if (isLoading) {
    return (
      <div className="flex h-[42px] w-full items-center justify-center rounded border-[1px] border-solid border-main">
        <div className="w-[24px] animate-spin">
          <TbLoader size={24} />
        </div>
      </div>
    );
  }

  return (
    <SelectThemed
      control={control}
      reset={reset}
      name="classroom"
      label={label || 'Turma'}
      placeholder={placeholder || 'Turma'}
      options={data?.data?.options}
      onChange={onChange}
    />
  );
};
