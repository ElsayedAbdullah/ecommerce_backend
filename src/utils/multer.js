import multer, { diskStorage } from "multer";

export const filterObject = {
  image: ["image/png", "image/jpeg"],
  pdf: ["application/pdf"],
};

export const fileUpload = (filterArray) => {
  function fileFilter(req, file, cb) {
    if (!filterArray.includes(file.mimetype)) {
      return cb(new Error("Invalid file format"), false);
    }
    return cb(null, true);
  }
  return multer({ storage: diskStorage({}), fileFilter });
};
