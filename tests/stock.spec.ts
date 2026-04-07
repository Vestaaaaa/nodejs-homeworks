import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app.js";

const app = buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("POST /stock/shipments", () => {
  it("should return 400 for invalid request", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock/shipments",
      payload: {
        warehouse: "",
        ingredients: [{ name: "Flour", quantity: -5 }],
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 200 for valid request", async () => {
    const validPayload = {
      warehouse: "Main Warehouse",
      ingredients: [
        { name: "Mozzarella", quantity: 100 },
        { name: "Tomato Sauce", quantity: 50 },
      ],
    };

    const response = await app.inject({
      method: "POST",
      url: "/stock/shipments",
      payload: validPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(validPayload);
  });
});
