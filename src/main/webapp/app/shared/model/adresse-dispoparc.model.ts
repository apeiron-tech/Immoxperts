import { IMutation } from 'app/shared/model/mutation.model';
import { IAdresse } from 'app/shared/model/adresse.model';

export interface IAdresseDispoparc {
  iddispopar?: number;
  mutation?: IMutation | null;
  adresse?: IAdresse | null;
}

export const defaultValue: Readonly<IAdresseDispoparc> = {};
