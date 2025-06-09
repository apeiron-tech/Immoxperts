export interface IAdresse {
  id?: number;
  idadresse?: number;
  novoie?: number | null;
  btq?: string | null;
  typvoie?: string | null;
  codvoie?: string | null;
  voie?: string | null;
  codepostal?: string | null;
  commune?: string | null;
  coddep?: string | null;
}

export const defaultValue: Readonly<IAdresse> = {};
