import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import type { PrismaError } from '@/types/prismaError';
import type { UserAuth } from '@/types/userAuth';

interface ILoginForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: boolean;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ILoginForm>({ mode: 'onChange' });

  const router = useRouter();

  const changePassswordHandle = async (data: ILoginForm): Promise<UserAuth> => {
    return (await axiosApi.post('/user/password', data)).data;
  };

  const { isLoading, mutate } = useMutation(
    'changePasswordMutation',
    changePassswordHandle,
    {
      onError: (error: PrismaError) => {
        toast.error(
          error.response.data.message || 'Algo deu errado no seu login!',
        );
      },
      onSuccess: () => {
        router.push('/dashboard');
      },
    },
  );

  const onSubmit = (data: ILoginForm) => {
    mutate(data);
  };

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

  return (
    <div className="flex h-[100vh] w-full justify-center">
      <div className="relative hidden h-full w-[42%] lg:inline">
        <Image src="/assets/images/login.png" alt="" fill />
      </div>
      <div className="w-full px-[20px] md:w-[58%] lg:px-[190px]">
        <div className="mt-[32px]">
          <div className="relative mx-auto h-[109px] w-[320px] md:w-[353px]">
            <Image src="/assets/images/logo.png" alt="" fill />
          </div>
        </div>
        <div className="text-center text-[16px] text-main">
          <p>
            Parece que é seu primeiro login! será necessário definir uma nova
            senha
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[16px]">
            <InputPasswordThemed
              label="Senha Atual"
              type="password"
              placeholder="********"
              register={register}
              name="oldPassword"
              validations={{
                required: 'Campo obrigatório',
                minLength: {
                  value: 8,
                  message: 'a senha deve conter no mínimo 8 caracteres',
                },
              }}
              error={errors.oldPassword}
            />
          </div>
          <div className="mt-[32px]">
            <InputPasswordThemed
              label="Senha Nova"
              type="password"
              placeholder="********"
              register={register}
              name="newPassword"
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
              error={errors.newPassword}
            />
          </div>
          <div className="mt-[32px]">
            <InputPasswordThemed
              label="Confirme a Senha Nova"
              type="password"
              placeholder="********"
              register={register}
              name="confirmNewPassword"
              validations={{
                required: 'Campo obrigatório',
                validate: (e) => {
                  return passwordValidator(e) || getValues('newPassword') !== e
                    ? 'As senhas devem ser iguais'
                    : undefined;
                },
                minLength: {
                  value: 8,
                  message: 'a senha deve conter no mínimo 8 caracteres',
                },
              }}
              error={errors.confirmNewPassword}
            />
          </div>
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
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
