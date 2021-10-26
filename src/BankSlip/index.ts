import { Request, Response } from "express";
import { verifyConvenio } from "../BoletoConvenio";
import { verifyTitulo } from "../BoletoTitulo";

const TITULO = "TITULO";
const CONVENIO = "CONVENIO";

export const isValidNumber = (numBoleto: string): string | null => {

  if (numBoleto.length === 48 && numBoleto[0] === '8') {
    return CONVENIO;
  }

  if (numBoleto.length === 47) {
    return TITULO;
  }

  return null;
}

export const getInfo = async (req: Request, res: Response): Promise<Response> => {

  const { numBoleto } = req.params;

  if (!(/^-?\d+$/.test(numBoleto)))
    return res.status(400).send("Permitido apenas números como entrada (0-9)");

  const tipoBoleto = isValidNumber(numBoleto);

  if (tipoBoleto === CONVENIO) {
    return await verifyConvenio(numBoleto, res);
  }

  if (tipoBoleto === TITULO) {
    return await verifyTitulo(numBoleto, res);
  }

  return res.status(400).send("Quantidade de dígitos errados ou tipo de boleto não aceito");


}