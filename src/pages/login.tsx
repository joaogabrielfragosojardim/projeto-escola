import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destroyCookie, setCookie } from 'nookies';
import { useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { axiosApi } from '@/components/api/axiosApi';
import { InputPasswordThemed } from '@/components/ui/forms/InputPasswordThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { useUserDispatch } from '@/store/user/context';
import { UserTypesEnum } from '@/store/user/types';
import type { PrismaError } from '@/types/prismaError';
import type { UserAuth } from '@/types/userAuth';

interface ILoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  const router = useRouter();
  const dispatch = useUserDispatch();

  const loginHandle = async (data: ILoginForm): Promise<UserAuth> => {
    return (await axiosApi.post('/auth', data)).data;
  };

  const { isLoading, mutate } = useMutation('loginMutation', loginHandle, {
    onError: (error: PrismaError) => {
      toast.error(
        error.response.data.message || 'Algo deu errado no seu login!',
      );
    },
    onSuccess: (data) => {
      const {
        token,
        user: { id, name, email, role, visualIdentity, isFirstAccess },
      } = data;
      destroyCookie(null, 'token');
      destroyCookie(null, 'user');
      setCookie(null, 'token', token);
      setCookie(
        null,
        'user',
        JSON.stringify({ id, name, email, role, visualIdentity }),
      );
      axiosApi.defaults.headers.Authorization = `Bearer ${token}`;
      dispatch({
        type: UserTypesEnum.ADD_USER,
        payload: {
          id,
          name,
          email,
          role,
          visualIdentity,
          isFirstAccess: false,
        },
      });
      if (isFirstAccess) {
        return router.push('/first-access');
      }
      return router.push('/dashboard');
    },
  });

  const onSubmit = (data: ILoginForm) => {
    mutate(data);
  };

  return (
    <div className="flex h-[100vh] w-full justify-center">
      <div className="relative hidden h-full w-[42%] lg:inline">
        <Image
          src="/assets/images/login.jpg"
          alt=""
          fill
          quality={100}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="w-full px-[20px] md:w-[58%] lg:px-[190px]">
        <div className="mt-[32px]">
          <div className="relative mx-auto h-[109px] w-[320px] md:w-[353px]">
            <Image src="/assets/images/logo.png" alt="" fill />
          </div>
        </div>
        <div className="text-center text-[24px] text-main">
          <p>Seja bem-vindo(a) à Escola Prime</p>
        </div>
        <form className="mt-[52px]" onSubmit={handleSubmit(onSubmit)}>
          <InputThemed
            label="E-mail"
            placeholder="seu e-mail"
            register={register}
            name="email"
            validations={{ required: 'Campo obrigatório' }}
            error={errors.email}
          />
          <div className="mt-[32px]">
            <InputPasswordThemed
              label="Senha"
              type="password"
              placeholder="********"
              register={register}
              name="password"
              validations={{
                required: 'Campo obrigatório',
                minLength: {
                  value: 6,
                  message: 'a senha deve conter no mínimo 6 caracteres',
                },
              }}
              error={errors.password}
            />
          </div>
          <div className="mt-[16px] flex justify-between">
            <div />
            <Link href="/forgot-password" className="text-[14px] text-main">
              Esqueceu a senha?
            </Link>
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
