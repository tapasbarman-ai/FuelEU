import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
export declare function validateSchema(schema: AnyZodObject): (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validateSchema.d.ts.map