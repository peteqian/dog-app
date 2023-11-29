export interface Post {
  message:
    | {
        [key: string]: string[];
      }
    | string
    | string[];
  status: string;
}
