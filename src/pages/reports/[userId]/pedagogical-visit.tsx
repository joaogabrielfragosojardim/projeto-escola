import React from 'react';
import { useForm } from 'react-hook-form';

import { InputCheckBoxThemed } from '@/components/ui/forms/InputCheckBoxThemed';
import { InputThemed } from '@/components/ui/forms/InputThemed';
import { SideNavMenuContainer } from '@/components/ui/SideNavMenuContainer';

const PedagogicalVisit = () => {
  const { register } = useForm();
  return (
    <SideNavMenuContainer title="Visita Pedagógica">
      <div className="p-[32px] text-complement-200">
        <form className="flex max-w-[875px] flex-col gap-[22px]">
          <div>
            <h3 className="text-[22px]">Aspectos organizacionais</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O ambiente é alfabetizador?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O educador circula pela sala de aula?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O ritmo das orientações é adequado para atender aos estudantes que apresentam mais dificuldades?"
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">
              Processos e estratégias de ensino de aprendizagem
            </h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O educador demonstra domínio do conteúdo e das habilidades prostas?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Os objetivos da aula são informados aos estudantes?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Ocorre a contextualização entre o conteúdo e as vivências do estudante?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Os estudantes que apresentam maiores dificuldades recebem atenção diferenciada?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O educador observa a forma de registro do estudante e conduz a aula no sentido de alcançar o objetivo proposto?"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="O educador segue a rotina proposta (para a aula) pelo projeto"
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Interação do estudante na aula</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="A maioria dos estudantes participam da aula?"
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">
              Plano de aula e estratégia de ensino
            </h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="A maioria dos estudantes participam da aula?"
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Rotina de alfabetização</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Leitura"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Escrita"
              />
              <InputCheckBoxThemed
                register={register}
                name="s"
                label="Atividades diferenciadas"
              />
            </div>
          </div>
          <div>
            <h3 className="text-[22px]">Frequência</h3>
            <div className="mt-[16px] grid grid-cols-1 gap-[16px]">
              <InputThemed
                register={register}
                name="s"
                placeholder="10"
                label="Quantidade de alunos presentes"
              />
            </div>
          </div>
          <InputThemed
            register={register}
            name="s"
            label="Observações"
            placeholder="Observações..."
          />
        </form>
      </div>
    </SideNavMenuContainer>
  );
};

export default PedagogicalVisit;
