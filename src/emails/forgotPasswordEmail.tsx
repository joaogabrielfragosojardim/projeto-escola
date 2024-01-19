/* eslint-disable import/no-extraneous-dependencies */
import { Button } from '@react-email/button';
import { Column } from '@react-email/column';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Row } from '@react-email/row';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { LOGO_URL } from '@/constants/contacts';
import * as React from 'react';

interface ForgotPasswordEmailTemplateProps {
  url: string;
  email: string;
}

export const ForgotPasswordEmail: React.FC<
  Readonly<ForgotPasswordEmailTemplateProps>
> = ({ url, email }) => (
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
            src={LOGO_URL}
          />
        </Column>
      </Row>

      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Uma solicitação de recuperação de senha foi realizada para sua conta (
        {email}). Se você não foi o autor, apenas descarte esse e-mail.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Para continuar com a recuperação de senha clique no botão abaixo para
        criar uma nova senha. Ah, esse link expira em 3 horas.
      </Text>
      <Text style={{ fontSize: '16px', color: '#18181b', lineHeight: '24px' }}>
        Equipe Escola Prime.
      </Text>
      <Row>
        <Column style={containerButton}>
          <Button href={url} style={button}>
            Criar nova senha
          </Button>
        </Column>
      </Row>
    </Section>
  </Html>
);

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const button = {
  padding: '16px',
  borderRadius: '8px',
  fontSize: '16px',
  color: '#ffffff',
  lineHeight: '24px',
  backgroundColor: '#5C6189',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
};

const img = {
  width: '230px',
  textAlign: 'center' as const,
  margin: '0 auto',
};
