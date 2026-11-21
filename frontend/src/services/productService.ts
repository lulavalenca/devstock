const API_URL = "http://localhost:8000";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
}

export interface ProductInput {
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  category: string;
}

async function handleResponse<T>(
  response: Response
): Promise<T> {
  if (!response.ok) {
    let message = "Ocorreu um erro na operação.";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
  };
}

// LISTAR PRODUTOS
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/`);
  const data = await handleResponse<Product[]>(response);

  return data.map(normalizeProduct);
}

// CADASTRAR PRODUTO
export async function createProduct(
  product: ProductInput
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await handleResponse<Product>(response);
  return normalizeProduct(data);
}

// ATUALIZAR PRODUTO
export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await handleResponse<Product>(response);
  return normalizeProduct(data);
}

// EXCLUIR PRODUTO
export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}