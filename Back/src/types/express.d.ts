import 'express';

declare global {
  namespace Express {
    interface Request {
      files?: any[];
      user: {
        id: string;
        name: string;
        role: string;
        email: string;
        [key: string]: any;
      };
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
  }
}

export {}; 