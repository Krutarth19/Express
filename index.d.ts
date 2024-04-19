export {};

// global interfaces
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      isSuperAdmin?: boolean;
      isDomain?: boolean;
      isCompany?: boolean;
      isSeller?: boolean;
      domainId?: number;
      isCustomer?: boolean;
      isDistributor?: boolean;
      isWarehouse?: boolean;
      companyId?: number;
    }

    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }

    interface Request {
      user?: User;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}
