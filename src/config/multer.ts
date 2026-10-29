
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve(
  process.cwd(),
  "uploads",
  "cronogramas"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
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

    cb(
      null,
      `${Date.now()}-${nomeOriginal}${extensao.toLowerCase()}`
    );
  },
});

const imageFileFilter: multer.Options["fileFilter"] = (
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

const pdfFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const extensao = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    extensao !== ".pdf" ||
    file.mimetype !== "application/pdf"
  ) {
    return cb(
      new Error("Arquivo inválido. Selecione um documento PDF.")
    );
  }

  cb(null, true);
};

// Upload de fotos: mantém o limite original de 5 MB.
export const uploadCronograma = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Upload da lista de presença: limite de 10 MB.
export const uploadListaPresenca = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
