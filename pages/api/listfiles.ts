import fs from "fs";
import path from "path";

export default (
  req: any,
  res: {
    statusCode: number;
    json: (arg0: { name: string; path: string }[]) => void;
  }
) => {
  const dirRelativeToPublicFolder = "uploads";

  const dir = path.resolve("./public", dirRelativeToPublicFolder);

  const filenames = fs.readdirSync(dir);

  const jsonfiles = filenames.map((name) => {
    return {
      name: name
        .substring(0, name.lastIndexOf("."))
        .slice(name.indexOf("_") + 1),
      path: name,
    };
  });

  res.statusCode = 200;
  res.json(jsonfiles);
};
