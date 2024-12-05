export interface User {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  admin?: string;
  isAuthenticated: boolean;
}

export type Author = {
  name: string;
  avatar: string;
};

export type Article = {
  tag: string;
  title: string;
  description: string;
  Approval?: string;
  authors: Author[];
};

export interface Alert {
  _id: string;
  title: string;
  description: string;
  creator: string;
  read: boolean;
}
