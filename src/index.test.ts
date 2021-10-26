import request from 'supertest';
import app from './index';

describe('Test validation', () => {
  test("It should be able to send numbers", async () => {
    const response = await request(app).get("/boleto/asdasd123123");
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Permitido apenas números como entrada (0-9)");
  });

  test("Should be return info from valid Título number", async () => {
    const response = await request(app).get("/boleto/21290001192110001210904475617405975870000002000");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("barCode", "21299758700000020000001121100012100447561740");
    expect(response.body).toHaveProperty("amount", "20.00");
    expect(response.body).toHaveProperty("expirationDate", "2018-07-16");
  });

  test("Should be return info from valid Convenio number", async () => {
    const response = await request(app).get("/boleto/838600000050096000190009000801782309000343062712");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("barCode", "83860000005096000190000008017823000034306271");
    expect(response.body).toHaveProperty("amount", "509.60");
    expect(response.body).toHaveProperty("expirationDate", "0000-00-80");
  });



})
