import { Response } from "express";
import { InfoResponse } from "../declarations";
import { MOD10, MOD11 } from "../constants";
import { getValue } from "../utils";


export const getInfoBoletoTitulo = (barCode: string): InfoResponse => {


  const fatorVencimento = barCode.substring(5, 9);
  const valor = barCode.substring(9, 19);

  const data = new Date("1997-10-07").getTime();
  const fatorMS = Number(fatorVencimento) * 24 * 60 * 60 * 1000;
  const novaData = new Date(data + fatorMS);


  const responseValue = getValue(valor);

  const year = novaData.getFullYear();
  const month = (novaData.getMonth() + 1).toLocaleString('pt-BR', {
    minimumIntegerDigits: 2
  });
  const day = (novaData.getDate() + 1).toLocaleString('pt-BR', {
    minimumIntegerDigits: 2
  });

  const expirationDate = `${year}-${month}-${day}`;

  return {
    amount: responseValue,
    barCode,
    expirationDate,
  }
}

export const verifyDVMod10Campo = (campo: string, dv: string): boolean => {

  const sumTotal = campo.split('').reverse().reduce((prev, value, index) => {

    let indexMOD10 = index % 2;
    const response = MOD10[indexMOD10] * Number(value);
    const sumAlgarismos = response.toString().split('').map((alg) => Number(alg)).reduce((prev, curr) => curr + prev, 0);
    return prev + sumAlgarismos;

  }, 0);

  const mod = sumTotal % 10;

  let correctDVG = 10 - mod;

  if (mod === 0)
    correctDVG = 0;

  return correctDVG === Number(dv);

}

export const verifyMod10 = (numBar: string): boolean => {

  const primeiroCampo = numBar.substring(0, 9);
  const primeiroDv = numBar[9];

  if (!verifyDVMod10Campo(primeiroCampo, primeiroDv)) {
    return false;
  }

  const segundoCampo = numBar.substring(10, 20);
  const segundoDv = numBar[20];

  if (!verifyDVMod10Campo(segundoCampo, segundoDv)) {
    return false;
  }

  const terceiroCampo = numBar.substring(21, 31);
  const terceiroDv = numBar[31];

  if (!verifyDVMod10Campo(terceiroCampo, terceiroDv)) {
    return false;
  }



  return true;

}

export const extratcBarCode = (numBar: string): string => {

  const codIf = numBar.substring(0, 3);
  const codMoeda = numBar[3];
  const POS_20_24 = numBar.substring(4, 9);

  const POS_25_34 = numBar.substring(10, 20);
  const POS_35_44 = numBar.substring(21, 31);
  const dv = numBar[32];
  const fatorVencimento = numBar.substring(33, 37);
  const valor = numBar.substring(37);



  const barCode = `${codIf}${codMoeda}${dv}${fatorVencimento}${valor}${POS_20_24}${POS_25_34}${POS_35_44}`;


  return barCode;
}

export const extractBarcodeWithoutDV = (barcode: string): string => {
  return `${barcode.substring(0, 4)}${barcode.substring(5)}`;
}

export const verifyDVMod11 = (numBar: string): boolean => {

  const barcode = extratcBarCode(numBar);
  const barcodeWithoutDV = extractBarcodeWithoutDV(barcode);
  const dv = barcode[4];
  let indexMOD11 = 0;

  const sumTotal = barcodeWithoutDV.split('').reverse().reduce((prev, value, index) => {

    if (indexMOD11 > 7) {
      indexMOD11 = 0;
    }

    const response = MOD11[indexMOD11] * Number(value);

    indexMOD11 += 1;

    return prev + response;

  }, 0);

  const mod = sumTotal % 11;

  let correctDVG = 11 - mod;

  if (mod === 1 || mod === 0 || mod === 10)
    correctDVG = 1;


  return correctDVG === Number(dv);
}

export const verifyTitulo = async (numBoleto: string, res: Response): Promise<Response> => {

  if (!verifyMod10(numBoleto))
    return res.status(400).send("Número inválido");

  if (!verifyDVMod11(numBoleto))
    return res.status(400).send("Número inválido");

  const infoBoleto = getInfoBoletoTitulo(extratcBarCode(numBoleto));


  return res.status(200).send({ ...infoBoleto });

}