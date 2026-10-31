/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Server Error]:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 10 MB limit. Please select a smaller photo.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}
