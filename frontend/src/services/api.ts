
import type { Product } from "../types/product";

const API_URL = "http://localhost:8000";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os produtos.");
  }

  return response.json() as Promise<Product[]>;
}