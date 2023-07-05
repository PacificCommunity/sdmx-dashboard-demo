import formidable, {errors as formidableErrors} from "formidable";
import { promises as fs } from 'fs';
import YamlValidator from "yaml-validator";
import type { NextApiRequest } from "next";

export const FormidableError = formidableErrors.FormidableError;

export const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return await new Promise(async (resolve, reject) => {
    const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 1024 * 1024 * 10, // 10 MB
        uploadDir: "./public/uploads",
        filename: (_name, _formfields) => {
            const filename = `${Date.now()}-${_name}`;
            return filename;
        },
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            reject(err);
            return;
        }
        const options = {
            structure: {
                DashID: 'string',
                items: [{
                    Row: 'number',
                    chartType: 'string',
                    Title: 'string'
                }]
            }
        }

        const validator = new YamlValidator(options);
        validator.validate([files['media'][0].filepath]);
        console.log(validator.report());
        resolve({ fields, files });
    });
  });
};