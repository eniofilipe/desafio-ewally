import { getModArrecadacao, verifyDacMod11, extractBarCodeArrecadacao, verifyDAGMod11, verifyDAGMod10, verifyDacMod10, getInfoBoletoArrecadacao } from './index';

describe('Test validation', () => {

  test("Should be return modules by identifier", () => {

    const response1 = getModArrecadacao("816700000000000000000000000000000000000000000000");
    const response2 = getModArrecadacao("817700000000000000000000000000000000000000000000");
    const response3 = getModArrecadacao("818700000000000000000000000000000000000000000000");
    const response4 = getModArrecadacao("819700000000000000000000000000000000000000000000");

    expect(response1).toBe(10);
    expect(response2).toBe(10);
    expect(response3).toBe(11);
    expect(response4).toBe(11);
  });

  test("Should be return module 11 validation", () => {
    const response = verifyDacMod11("838600000050096000190009000801782309000343062712");
    expect(response).toBe(true);
    const response2 = verifyDacMod10("846300000003299902962024004101360008002006441147");
    expect(response2).toBe(true);
  });

  test("Should extract barcode digits in order", () => {
    const response = extractBarCodeArrecadacao("838600000050096000190009000801782309000343062712");
    expect(response).toBe("83860000005096000190000008017823000034306271");
  });

  test("Verify DVG", () => {
    const response = verifyDAGMod11("838600000050096000190009000801782309000343062712");
    expect(response).toBe(true);
    const response2 = verifyDAGMod10("846300000003299902962024004101360008002006441147");
    expect(response2).toBe(true);
  })

  test("Get info valid barcode", () => {
    const response = getInfoBoletoArrecadacao("83860000005096000190000008017823000034306271");
  })

})