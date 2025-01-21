import { Depart } from './depart';

export type User = {
  account: string;

  email?: string;

  id: string;

  name: string;

  password: string;

  phone?: string;

  status: number;

  departId?: string;
};

export interface UserData extends User {
  depart: Depart;
}
