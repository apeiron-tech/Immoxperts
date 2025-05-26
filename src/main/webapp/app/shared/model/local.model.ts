export interface ILocal {
  id?: number;
  iddispoloc?: number;
  idmutation?: number | null;
  sbati?: number | null;
  libtyploc?: string | null;
  nbpprinc?: number | null;
}

export const defaultValue: Readonly<ILocal> = {};
