export {};

/**
 * @override User Type Definition
 */
declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }
  }
}
