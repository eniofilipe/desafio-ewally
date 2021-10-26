import { Response } from "express";
import { InfoResponse } from "../declarations";
import { MOD10, MOD11 } from "../constants";
import { getValue } from "../utils";




export const getInfoBoletoArrecadacao = (barCode: string): InfoResponse => {


  const idOrg = barCode[1];
  const valor = barCode.slice(4, 15);
  let validade;

  if (idOrg === '9') {
    validade = barCode.slice(23, 31);
  } else {
    validade = barCode.slice(19, 27);
  }


  const responseValue = getValue(valor);


  let date = `${validade.slice(0, 4)}-${validade.slice(4, 6)}-${validade.slice(6, 8)}`;
  return {
    amount: responseValue,
    barCode: barCode,
    expirationDate: date
  };
}

export const getModArrecadacao = (numBoleto: string): number => {

  const Identificador = numBoleto.charAt(2);

  switch (Identificador) {
    case '6':
      return 10;
    case '7':
      return 10;
    case '8':
      return 11;
    case '9':
      return 11;
    default:
      return -1;
  }

}

export const extractBarCodeArrecadacao = (numBoleto: string): string => {

  const arrSub = numBoleto.match(/.{1,12}/g);
  if (arrSub) {
    const arrWithoutDAC = arrSub.map(sub => sub.slice(0, sub.length - 1)).join('');

    return arrWithoutDAC;
  }

  return "";

}

export const verifyDAGMod11 = (numBoleto: string): boolean => {

  const barcode = extractBarCodeArrecadacao(numBoleto);
  if (barcode !== "") {
    const barcodeWithoutDG = barcode.slice(0, 3).concat(barcode.slice(4));
    let indexMOD11 = 0;


    const sumTotal = barcodeWithoutDG.split('').reverse().reduce((prev, value, index) => {

      if (indexMOD11 > 7) {
        indexMOD11 = 0;
      }


      const response = MOD11[indexMOD11] * Number(value);

      indexMOD11 += 1;

      return prev + response;

    }, 0);

    const mod = sumTotal % 11;

    let correctDVG = 11 - mod;

    if (mod === 1 || mod === 0)
      correctDVG = 0;

    if (mod === 10)
      correctDVG = 1;



    return correctDVG === Number(barcode[3]);

  }

  return false;
}

export const verifyDAGMod10 = (numBoleto: string): boolean => {

  const barcode = extractBarCodeArrecadacao(numBoleto);
  if (barcode !== "") {
    const barcodeWithoutDG = barcode.slice(0, 3).concat(barcode.slice(4));



    const sumTotal = barcodeWithoutDG.split('').reverse().reduce((prev, value, index) => {

      let indexMOD10 = index % 2;
      const response = MOD10[indexMOD10] * Number(value);
      const sumAlgarismos = response.toString().split('').map((alg) => Number(alg)).reduce((prev, curr) => curr + prev, 0);
      return prev + sumAlgarismos;

    }, 0);

    const mod = sumTotal % 10;

    let correctDVG = 10 - mod;

    if (mod === 0)
      correctDVG = 0;



    return correctDVG === Number(barcode[3]);

  }

  return false;
}

export const verifyDacMod11 = (numBoleto: string): boolean => {

  const subCod = numBoleto.match(/.{1,12}/g);

  if (subCod) {
    const arrDvs = subCod.map((cod) => Number(cod.charAt(cod.length - 1)));

    const arrNumbers = subCod.map((cod) => {
      let numbers: number[] = [];
      for (let i = 0; i < 11; i++) {
        numbers = [...numbers, Number(cod.charAt(i))];
      }
      return numbers;
    })

    const resultsSumMul = arrNumbers.map(numbers => numbers.reverse().reduce((prev, value, index) => {

      const indexMOD11 = index < 8 ? index : index - 8;
      return prev + (value * MOD11[indexMOD11]);

    }, 0))

    const correctsDVS = resultsSumMul.map(value => {
      const mod = value % 11;
      if (mod === 1 || mod === 0)
        return 0;

      if (mod === 10)
        return 1;

      return 11 - mod;
    })

    let response = true;
    arrDvs.forEach((value, index) => {
      if (value !== correctsDVS[index])
        response = false;
    });
    return response;
  }

  return false;
}

export const verifyDacMod10 = (numBoleto: string): boolean => {

  const subCod = numBoleto.match(/.{1,12}/g);

  if (subCod) {
    const arrDvs = subCod.map((cod) => Number(cod.charAt(cod.length - 1)));

    const arrNumbers = subCod.map((cod) => {
      let numbers: number[] = [];
      for (let i = 0; i < 11; i++) {
        numbers = [...numbers, Number(cod.charAt(i))];
      }
      return numbers;
    })

    const resultsSumMul = arrNumbers.map(numbers => numbers.reverse().reduce((prev, value, index) => {

      const indexMOD10 = index % 2;

      const response = (value * MOD10[indexMOD10]);

      const sumAlgarismos = response.toString().split('').map((alg) => Number(alg)).reduce((prev, curr) => curr + prev, 0);

      return prev + sumAlgarismos;

    }, 0))


    const correctsDVS = resultsSumMul.map(value => {
      const mod = value % 10;
      if (mod === 0)
        return mod;

      return 10 - mod;
    })

    let response = true;
    arrDvs.forEach((value, index) => {
      if (value !== correctsDVS[index])
        response = false;
    });



    return response;
  }

  return false;
}


export const verifyConvenio = async (numBoleto: string, res: Response): Promise<Response> => {

  const mod = getModArrecadacao(numBoleto);

  if (mod === 10) {
    if (!verifyDacMod10(numBoleto))
      return res.status(400).send("Número inválido");

    if (!verifyDAGMod10(numBoleto))
      return res.status(400).send("Número inválido");

    const infoBoleto = getInfoBoletoArrecadacao(extractBarCodeArrecadacao(numBoleto));

    return res.status(200).send({ ...infoBoleto });

  }

  if (mod === 11) {
    if (!verifyDacMod11(numBoleto))
      return res.status(400).send("Número inválido");

    if (!verifyDAGMod11(numBoleto))
      return res.status(400).send("Número inválido");

    const infoBoleto = getInfoBoletoArrecadacao(extractBarCodeArrecadacao(numBoleto));

    return res.status(200).send({ ...infoBoleto });

  }

  return res.status(400).send("Erro ao identificar módulo");



}