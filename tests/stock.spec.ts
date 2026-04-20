import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';

const app = buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('POST /stock/shipments', () => {
  it('should return 400 for invalid request', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/stock/shipments',
      payload: {
        targetWarehouse: '',
        ingredients: []
      }
    });

    expect(response.statusCode).toBe(400);
  });
});