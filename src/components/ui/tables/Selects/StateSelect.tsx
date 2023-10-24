import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const StateSelect = ({
  onChange,
  label,
  placeholder,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const fetchStatesOptions = async () => {
    return axiosApi.get(
      'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
    );
  };

  const { data, isLoading } = useQuery('fetchStatesTable', fetchStatesOptions);

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
      name="state"
      label={label || 'Estado'}
      placeholder={placeholder || 'Estado'}
      options={data?.data?.map((item: { sigla: string }) => ({
        label: item.sigla,
        value: item.sigla,
      }))}
      onChange={onChange}
    />
  );
};
