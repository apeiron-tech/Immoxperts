import dayjs from 'dayjs';

export interface IMutation {
  id?: number;
  idmutation?: number;
  datemut?: dayjs.Dayjs | null;
  valeurfonc?: number | null;
  idnatmut?: number | null;
  coddep?: string | null;
  vefa?: boolean | null;
  sterr?: number | null;
}

export const defaultValue: Readonly<IMutation> = {
  vefa: false,
};
