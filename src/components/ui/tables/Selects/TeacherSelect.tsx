import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const TeacherSelect = ({
  projectId,
  schoolId,
  coordinatorId,
  onChange,
  label,
  placeholder,
}: {
  projectId?: string;
  schoolId?: string;
  coordinatorId?: string;
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
}) => {
  const { control, reset } = useForm();

  const fetchTeacherOptions = async () => {
    return axiosApi.get('/teacher/options', {
      params: { schoolId, projectId, coordinatorId },
    });
  };

  const { data, isLoading, refetch } = useQuery(
    'fetchTeachtOptions',
    fetchTeacherOptions,
  );

  useEffect(() => {
    if (schoolId || projectId || coordinatorId) {
      refetch();
    }
  }, [schoolId, coordinatorId, refetch, projectId]);

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
      label={label || 'Educador Social'}
      placeholder={placeholder || 'Educador Social'}
      options={data?.data?.options}
      onChange={onChange}
    />
  );
};
