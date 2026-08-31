
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(
  process.cwd(),
  "uploads",
  "cronogramas"
);

// Cria a pasta automaticamente
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nomeOriginal = path
      .basename(file.originalname, extensao)
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const nomeArquivo =
      `${Date.now()}-${nomeOriginal}${extensao}`;

    cb(null, nomeArquivo);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const extensoesPermitidas = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extensao = path
    .extname(file.originalname)
    .toLowerCase();

  if (!extensoesPermitidas.includes(extensao)) {
    return cb(
      new Error(
        "Formato de imagem não permitido. Use JPG, JPEG, PNG ou WEBP."
      )
    );
  }

  cb(null, true);
};

export const uploadCronograma = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
