import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs, { promises as fsp } from "fs";
import YamlValidator from "yaml-validator";

export const config = {
  api: {
    bodyParser: false,
  },
};

const pathDist: string = path.join(process.cwd(), "/public/uploads");

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<String> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = pathDist;
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 1024 * 100; // 100 KB
  options.keepExtensions = true;

  console.log("PROCESSING...");

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      const validator = new YamlValidator({
        log: true,
        structure: false,
        onWarning: null,
        writeJson: true,
      });

      // console.log('UPLOADED FILE', files)

      const tmpfilepath = files.yamlfile[0].filepath;
      const finalname = `${Date.now()}_${files.yamlfile[0].originalFilename}`;

      // console.log("Validating YAML file", finalname);
      validator.validate([tmpfilepath]);

      // Copy YML file (commented, as  this is not needed)
      // fs.renameSync(tmpfilepath, `${pathDist}/${finalname}`)

      // delete YML file from tmp folder
      try {
        fsp.rm(tmpfilepath);
      } catch (e) {
        console.log(e);
      }

      if (validator.report() > 0) {
        reject("Not a valid YAML file")
      } else {
        // copy JSON file to upload dir
        const tmpjsonpath = tmpfilepath.replace(/\.y(a)?ml$/iu, ".json")
        const finaljson = finalname.replace(/\.y(a)?ml$/iu, ".json")
        fs.renameSync(tmpjsonpath, `${pathDist}/${finaljson}`)

        resolve(`${pathDist}/${finaljson}`)
      }
    });
  });
};

const handler: NextApiHandler = async (req: NextApiRequest, res) => {
  // try {
  //   await fs.readdir(pathDist);
  // } catch (error) {
  //   await fs.mkdir(pathDist);
  // }

  try {
    const filename = await readFile(req, false)
    return res
      .status(200)
      .json({ success: true, url: filename })
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
};

export default handler;
