interface User {
  email: string;
  name: string;
  visualIdentity: string | null;
}

interface AdmQuery {
  id: string;
  user: User;
}

export interface Adm {
  id: string;
  name: string;
  visualIdentity: string | null;
  email: string;
}

export function toAdms(adms: AdmQuery[]): Adm[] {
  return adms.map((adm) => ({
    id: adm.id,
    name: adm.user.name,
    visualIdentity: adm.user.visualIdentity,
    email: adm.user.email,
  }));
}

export function toAdm(adm: AdmQuery): Adm {
  return {
    id: adm?.id,
    name: adm.user.name,
    visualIdentity: adm.user.visualIdentity,
    email: adm.user.email,
  };
}
