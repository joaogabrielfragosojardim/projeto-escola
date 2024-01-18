import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useQuery } from 'react-query';

import { axiosApi } from '@/components/api/axiosApi';

import { SelectThemed } from '../../forms/SelectThemed';

export const StudentSelect = ({
  onChange,
  label,
  placeholder,
  projectId,
  classId,
  schoolId,
  teacherId,
  coordinatorId,
  period,
  year,
}: {
  onChange: (event: any) => void;
  label?: string;
  placeholder?: string;
  projectId?: string;
  classId?: string;
  schoolId?: string;
  coordinatorId?: string;
  period?: string;
  year?: string;
  teacherId?: string;
}) => {
  const { control, reset } = useForm();

  const fetchStudentOptions = async () => {
    return axiosApi.get('/student/options', {
      params: {
        projectId: projectId || undefined,
        classId: classId || undefined,
        schoolId: schoolId || undefined,
        teacherId: teacherId || undefined,
        coordinatorId: coordinatorId || undefined,
        period: period || undefined,
        year: year || undefined,
      },
    });
  };

  const { data, isLoading, refetch } = useQuery(
    'fetchStudentsOptionsTable',
    fetchStudentOptions,
  );

  useEffect(() => {
    if (schoolId || projectId || coordinatorId) {
      refetch();
    }
  }, [
    schoolId,
    coordinatorId,
    classId,
    teacherId,
    period,
    year,
    refetch,
    projectId,
  ]);

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
      name="student"
      label={label || 'Aluno'}
      placeholder={placeholder || 'Aluno'}
      options={data?.data?.options}
      onChange={onChange}
    />
  );
};
