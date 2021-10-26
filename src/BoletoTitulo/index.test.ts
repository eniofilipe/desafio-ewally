import { extratcBarCode, getInfoBoletoTitulo, verifyDVMod11, verifyMod10 } from "./index";

describe('Test Boleto Título', () => {
  test("Extract barcode", () => {
    const response = extratcBarCode("21290001192110001210904475617405975870000002000");
    expect(response).toBe("21299758700000020000001121100012100447561740");
  });

  test("Verify DV MOD11", () => {
    const response = verifyDVMod11("21290001192110001210904475617405975870000002000");
    expect(response).toBe(true);
  })

  test("Verify DV MOD10", () => {
    const response = verifyMod10("21290001192110001210904475617405975870000002000");
    expect(response).toBe(true);
  })

  test("Return data from valid barcode", () => {

    const response = getInfoBoletoTitulo("21299758700000020000001121100012100447561740");

    expect(response).toHaveProperty("barCode", "21299758700000020000001121100012100447561740");
    expect(response).toHaveProperty("amount", "20.00");
    expect(response).toHaveProperty("expirationDate", "2018-07-16");

  })


});