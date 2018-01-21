import * as supertest from "supertest";
import * as app from "../app";
const req = supertest(app);

describe("GET /", () => {
  test("should return 200", async () => {
    expect.assertions(1);
    const res: supertest.Response = await req.get("/");
    expect(res.status).toBe(200);
  });
});

describe("GET /random-url", () => {
  test("should return 404", async () => {
    expect.assertions(1);
    const res: supertest.Response = await req.get("/random-url");
    expect(res.status).toBe(404);
  });
});
