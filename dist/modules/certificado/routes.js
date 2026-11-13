"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificadoRoutes = void 0;
const express_1 = require("express");
const CertificadoController_1 = require("../../controllers/certificado/CertificadoController");
const certificadoRoutes = (0, express_1.Router)();
exports.certificadoRoutes = certificadoRoutes;
certificadoRoutes.get("/cronograma/:id", new CertificadoController_1.CertificadoController().handle);
