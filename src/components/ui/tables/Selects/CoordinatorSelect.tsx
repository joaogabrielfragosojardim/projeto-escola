import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const CoordinatorSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const fetchCoordinatorOptions = async () => {
    return axiosApi.get('/coordinator/options');
  };

  const { data, isLoading } = useQuery(
    'fetchCoordinatorOptions',
    fetchCoordinatorOptions,
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
      label={label || 'Coordenador'}
      placeholder={placeholder || 'Coordenador'}
      options={data?.data?.options}
      onChange={onChange}
    />
  );
};
