/* eslint-disable import/no-extraneous-dependencies */
import { Column } from '@react-email/column';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Row } from '@react-email/row';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';

interface PasswordEmailTemplateProps {
  password: string;
  name: string;
  url: string;
}

export const PasswordEmail: React.FC<Readonly<PasswordEmailTemplateProps>> = ({
  password,
  name,
  url,
}) => (
  <Html lang="pt-BR" style={main}>
    <Section
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: '1px solid #5C6189',
        maxWidth: '600px',
        padding: '24px',
      }}
    >
      <Row>
        <Column>
          <Img
            style={img}
            alt="Escola prime"
            src="https://jrgqdaonyjwefdaxvvjt.supabase.co/storage/v1/object/public/project-school-bucket/logo.png"
          />
        </Column>
      </Row>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Caro {name},
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        É um prazer tê-lo(a) conosco! Como parte do processo de ativação da sua
        conta, estamos enviando suas credenciais de acesso.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Sua senha temporária:{' '}
        <span
          style={{
            fontSize: '16px',
            color: '#5C6189',
            lineHeight: '24px',
            fontWeight: 600,
          }}
        >
          {password}
        </span>
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Por favor, lembre-se de manter suas credenciais em um local seguro e
        nunca compartilhá-las com ninguém. Recomendamos que você altere sua
        senha assim que possível para garantir a segurança da sua conta.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Para acessar a plataforma, siga estas etapas simples:
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Acesse: {url}
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Insira seu nome de usuário e a senha temporária fornecida acima.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Estamos ansiosos para tê-lo(a) aproveitando todos os recursos e
        benefícios da nossa plataforma.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Se precisar de qualquer assistência ou tiver dúvidas, não hesite em nos
        contatar através deste e-mail.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Obrigado(a) por se juntar a nós!
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Equipe Escola Prime.
      </Text>
    </Section>
  </Html>
);

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const img = {
  width: '230px',
  textAlign: 'center' as const,
  margin: '0 auto',
};
