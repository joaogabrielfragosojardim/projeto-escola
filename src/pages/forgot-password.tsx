import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import type { PrismaError } from '@/types/prismaError';

interface IForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordForm>();
  const router = useRouter();

  const forgotPassword = async ({
    email,
  }: IForgotPasswordForm): Promise<{ message: string }> => {
    const response = await axiosApi.post('/auth/forgotPassword', { email });

    return response.data;
  };

  const { isLoading, mutate } = useMutation<
    { message: string },
    PrismaError,
    string
  >({
    mutationFn: (email: string) => forgotPassword({ email }),
    onError: (error: PrismaError) => {
      toast.error(
        error.response.data.message ||
          'Ocorreu um erro ao recuperar sua senha.',
      );
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      router.push('/login');
    },
  });

  const onSubmit = (data: IForgotPasswordForm) => {
    mutate(data.email);
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
          <h1 className="my-5 text-center text-2xl">Esqueceu sua senha ?</h1>

          <p className="text-xl">
            Digite seu e-mail de recuperação, para gerar uma nova senha para sua
            conta.
          </p>
        </div>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <InputThemed
            placeholder="E-mail"
            register={register}
            name="email"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.email}
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
                'Recuperar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
