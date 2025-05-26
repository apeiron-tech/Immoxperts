import { IMutation } from 'app/shared/model/mutation.model';
import { IAdresse } from 'app/shared/model/adresse.model';

export interface IAdresseLocal {
  id?: number;
  coddep?: string | null;
  mutation?: IMutation | null;
  adresse?: IAdresse | null;
}

export const defaultValue: Readonly<IAdresseLocal> = {};
