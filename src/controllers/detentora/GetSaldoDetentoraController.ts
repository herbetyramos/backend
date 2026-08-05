import { Request, Response } from "express";
import { GetSaldoDetentoraService } from "../../services/Detentora/GetSaldoDetentoraService";

class GetSaldoDetentoraController {

    async handle(req: Request, res: Response) {

        try {

            const { id } = req.query;

            if (!id || typeof id !== "string") {

                return res.status(400).json({
                    error: "ID da detentora é obrigatório."
                });

            }

            const service = new GetSaldoDetentoraService();

            const saldo = await service.execute(id);

            return res.json(saldo);

        } catch (err: any) {

            return res.status(400).json({

                error: err.message

            });

        }

    }

}

export { GetSaldoDetentoraController };