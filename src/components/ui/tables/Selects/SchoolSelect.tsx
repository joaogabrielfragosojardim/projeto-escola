import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const SchoolSelect = ({
  coordinatorId,
  onChange,
  label,
  placeholder,
}: {
  coordinatorId?: string;
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const fetchSchoolOptions = async () => {
    return axiosApi.get('/school/options', {
      params: { coordinatorId },
    });
  };

  const { data, isLoading } = useQuery(
    'fetchSchoolOptionsTable',
    fetchSchoolOptions,
  );

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
      name="project"
      label={label || 'Escola'}
      placeholder={placeholder || 'Escola'}
      options={data?.data?.options}
      onChange={onChange}
    />
  );
};
