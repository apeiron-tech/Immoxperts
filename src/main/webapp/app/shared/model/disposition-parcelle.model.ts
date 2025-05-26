export interface IDispositionParcelle {
  id?: number;
  iddispopar?: number;
  dcntagri?: number | null;
  dcntsol?: number | null;
}

export const defaultValue: Readonly<IDispositionParcelle> = {};
