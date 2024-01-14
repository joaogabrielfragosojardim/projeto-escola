import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import type { PrismaError } from '@/types/prismaError';

interface IResetPasswordRequest {
  password: string;
  token: string;
}

const passwordValidator = (value: string) => {
  let warning = '';

  if (!value.match(/[A-Z]/g)) {
    warning += 'Deve conter letras Maiúsculas, ';
  }
  if (!value.match(/[a-z]/g)) {
    warning += 'Deve conter letras Minúsculas, ';
  }
  if (!value.match(/[0-9]/g)) {
    warning += 'Deve conter Números, ';
  }
  if (!value.match(/[^A-Za-z0-9]/g)) {
    warning += 'Deve conter caracteres especiais, ';
  }
  warning += '  Ex: Prime123@';
  return warning === '  Ex: Prime123@' ? undefined : warning;
};

type ResetPasswordForm = { password: string; confirmPassword: string };

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: 'onChange',
  });

  const { query, push } = useRouter();

  const resetPassword = async ({
    password,
    token,
  }: IResetPasswordRequest): Promise<{
    message: string;
  }> => {
    const response = await axiosApi.post('/auth/resetPassword', {
      password,
      token,
    });

    return response.data;
  };

  const { isLoading, mutate } = useMutation<
    { message: string },
    PrismaError,
    IResetPasswordRequest
  >({
    mutationFn: ({ password, token }) => resetPassword({ password, token }),
    onError: (error: PrismaError) => {
      toast.error(
        error.response.data.message || 'Ocorreu um erro ao resetar sua senha.',
      );
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      push('/login');
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    const payload: IResetPasswordRequest = {
      password: data.password,
      token: query.token as string,
    };
    mutate(payload);
  };

  return (
    <div className="flex h-[100vh] w-full justify-center">
      <div className="relative hidden h-full w-[42%] lg:inline">
        <Image src="/assets/images/login.png" alt="" fill />
      </div>
      <div className=" w-full  px-[20px] md:w-[58%] lg:px-[190px]">
        <div className="mt-[32px]">
          <div className="relative mx-auto h-[109px] w-[320px] md:w-[353px]">
            <Image src="/assets/images/logo.png" alt="Escola Prime" fill />
          </div>
        </div>
        <div className="my-4 text-main">
          <h1 className="my-5 text-center text-2xl">Redefinir senha</h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputPasswordThemed
            label="Nova senha"
            type="password"
            placeholder="Nova senha"
            register={register}
            name="password"
            error={errors.password}
            validations={{
              required: 'Campo obrigatório',
              minLength: {
                value: 8,
                message: 'a senha deve conter no mínimo 8 caracteres',
              },
            }}
          />

          <InputPasswordThemed
            label="Confirme sua nova senha"
            type="password"
            placeholder="Confirme sua senha"
            register={register}
            name="confirm_password"
            validations={{
              required: 'Campo obrigatório',
              validate: (e) => {
                return passwordValidator(e);
              },
              minLength: {
                value: 8,
                message: 'a senha deve conter no mínimo 8 caracteres',
              },
            }}
            error={errors.confirmPassword}
          />

          <div className="mt-[42px] flex w-full items-center justify-center">
            <button
              type="submit"
              className="mx-[auto] flex w-[45%] items-center justify-center gap-[16px] rounded-[5px] bg-main py-[16px] text-complement-100"
            >
              {isLoading ? (
                <div className="animate-spin">
                  <TbLoader size={24} />
                </div>
              ) : (
                'Alterar senha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
