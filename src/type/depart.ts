export type Depart = {
  name: string;

  description: string;

  key?: string;

  id?: string;

  parentId?: string;

  children?: Depart[];
};
