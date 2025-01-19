export interface CodeStoreBase {
  name: string;
  description?: string;
  type: string;
  address: string;
  owner: string;
}

export interface CodeStore extends CodeStoreBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
