const request = require("supertest");
const app = require("./app");

describe("GET /mean", () => {
  test("works", async () => {
    const resp = await request(app).get("/mean?nums=1,3,5,7");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ response: { operation: "mean", value: 4 } });
  });

  test("NaN error", async () => {
    const resp = await request(app).get("/mean?nums=foo,2,3");
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toMatch(/foo is not a number/);
  });

  test("missing nums", async () => {
    const resp = await request(app).get("/mean");
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toMatch(/nums are required/i);
  });
});

describe("GET /median", () => {
  test("works even length", async () => {
    const resp = await request(app).get("/median?nums=1,3,5,7");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.response.value).toBe(4);
  });
});

describe("GET /mode", () => {
  test("works", async () => {
    const resp = await request(app).get("/mode?nums=1,1,2,2,2,3");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.response.value).toBe(2);
  });
});

describe("GET /all", () => {
  test("works and returns all three", async () => {
    const resp = await request(app).get("/all?nums=1,2,3,4");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.response.operation).toBe("all");
    expect(resp.body.response).toHaveProperty("mean");
    expect(resp.body.response).toHaveProperty("median");
    expect(resp.body.response).toHaveProperty("mode");
  });
});