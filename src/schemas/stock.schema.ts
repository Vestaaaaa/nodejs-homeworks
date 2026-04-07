import { z } from "zod";

export const shipmentSchema = z.object({
  warehouse: z.string().min(1, "Warehouse name is required"),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, "ingredient name is required"),
        quantity: z.number().positive("quantity must be more than 0"),
      }),
    )
    .min(1, "At least one ingredient is requeired"),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
