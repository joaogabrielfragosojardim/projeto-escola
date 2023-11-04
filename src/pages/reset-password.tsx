import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { axiosApi } from '@/components/api/axiosApi';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import type { PrismaError } from '@/types/prismaError';

interface IResetPasswordRequest {
  password: string;
  token: string;
}

const schema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Digite uma senha com no mínimo 6 caracteres' }),
    confirm_password: z
      .string()
      .min(6, { message: 'Digite uma senha com no mínimo 6 caracteres' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'As senhas precisam ser iguais',
  });

type ResetPasswordForm = z.infer<typeof schema>;

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(schema),
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
          />

          <InputPasswordThemed
            label="Confirme sua nova senha"
            type="password"
            placeholder="Confirme sua senha"
            register={register}
            name="confirm_password"
            error={errors.confirm_password}
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
