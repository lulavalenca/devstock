
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product,
  type ProductInput,
} from "../services/productService";

import "./Inventory.css";

const PAGE_SIZE = 8;
const LOW_STOCK_LIMIT = 5;

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  category: "",
};

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);

  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  let active = true;

  getProducts()
    .then((data) => {
      if (active) {
        setProducts(data);
      }
    })
    .catch((err) => {
      if (active) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os produtos."
        );
      }
    })
    .finally(() => {
      if (active) {
        setLoading(false);
      }
    });

  return () => {
    active = false;
  };
}, []);

  const categories = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(products.map((product) => product.category))).sort(),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity <= LOW_STOCK_LIMIT
  ).length;

  const currency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: ProductInput = {
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description?.trim() || null,
        price: Number(form.price),
        quantity: Number(form.quantity),
      };

      if (
        !payload.name ||
        !payload.category ||
        !Number.isFinite(payload.price) ||
        !Number.isInteger(payload.quantity) ||
        payload.price < 0 ||
        payload.quantity < 0
      ) {
        throw new Error("Confira os dados informados.");
      }

      if (editingId !== null) {
        await updateProduct(editingId, payload);
        setSuccess("Produto atualizado com sucesso!");
      } else {
        await createProduct(payload);
        setSuccess("Produto cadastrado com sucesso!");
      }

      setModalOpen(false);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o produto.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");
      await deleteProduct(product.id);
      setSuccess("Produto excluído com sucesso!");
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o produto.",
      );
    }
  }

  return (
    <section className="inventory-page">
      <header className="inventory-header">
        <div>
          <span className="inventory-eyebrow">GESTÃO DE ESTOQUE</span>
          <h1>Inventário</h1>
          <p>Gerencie seus produtos, quantidades e valores em estoque.</p>
        </div>
        <button className="inventory-primary-btn" onClick={openCreateModal}>
          <Plus size={19} />
          Novo produto
        </button>
      </header>

      <div className="inventory-stats">
        <article className="inventory-stat-card">
          <span>Total de produtos</span>
          <strong>{products.length}</strong>
          <Package size={22} />
        </article>

        <article className="inventory-stat-card">
          <span>Unidades em estoque</span>
          <strong>{totalUnits}</strong>
          <Package size={22} />
        </article>

        <article className="inventory-stat-card">
          <span>Valor em estoque</span>
          <strong>{currency(inventoryValue)}</strong>
          <span className="stat-symbol">R$</span>
        </article>

        <article className="inventory-stat-card warning">
          <span>Estoque baixo</span>
          <strong>{lowStock}</strong>
          <AlertTriangle size={22} />
        </article>
      </div>

      {success && (
        <div className="inventory-message success-message">
          {success}
          <button onClick={() => setSuccess("")} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="inventory-message error-message">
          {error}
          <button onClick={() => setError("")} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="inventory-toolbar">
        <div className="inventory-search">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar produto ou categoria..."
          />
        </div>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          aria-label="Filtrar por categoria"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="inventory-refresh-btn"
          onClick={loadProducts}
          disabled={loading}
          title="Atualizar produtos"
          aria-label="Atualizar produtos"
        >
          <RefreshCw
            size={18}
            className={loading ? "refresh-spinning" : ""}
          />
        </button>
      </div>

      <div className="inventory-table-card">
        <div className="inventory-table-heading">
          <div>
            <h2>Produtos cadastrados</h2>
            <p>{filteredProducts.length} produto(s) encontrado(s)</p>
          </div>
        </div>

        {loading ? (
          <p className="inventory-empty">Carregando produtos...</p>
        ) : (
          <div className="inventory-table-scroll">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => {
                  const isLow = product.quantity <= LOW_STOCK_LIMIT;

                  return (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>
                        <div className="inventory-product-name">
                          <div className="inventory-product-icon">
                            <Package size={18} />
                          </div>
                          <div>
                            <strong>{product.name}</strong>
                            <small>
                              {product.description || "Sem descrição"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="inventory-category">
                          {product.category}
                        </span>
                      </td>
                      <td>{currency(product.price)}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span
                          className={`inventory-status ${isLow ? "low" : "normal"}`}
                        >
                          {isLow ? "Estoque baixo" : "Disponível"}
                        </span>
                      </td>
                      <td>
                        <div className="inventory-actions">
                          <button
                            onClick={() => openEditModal(product)}
                            title="Editar produto"
                            aria-label={`Editar ${product.name}`}
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            className="delete-action"
                            onClick={() => handleDelete(product)}
                            title="Excluir produto"
                            aria-label={`Excluir ${product.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="inventory-empty">
                <Package size={32} />
                <strong>Nenhum produto encontrado</strong>
                <span>Altere sua busca ou cadastre um novo produto.</span>
              </div>
            )}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="inventory-pagination">
            <span>
              Página {page} de {totalPages}
            </span>
            <div>
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="inventory-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="inventory-modal">
            <div className="inventory-modal-header">
              <div>
                <span>GESTÃO DE PRODUTOS</span>
                <h2>
                  {editingId !== null ? "Editar produto" : "Novo produto"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar formulário"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Nome do produto
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Ex.: Notebook Dell"
                />
              </label>

              <label>
                Descrição
                <textarea
                  maxLength={500}
                  value={form.description ?? ""}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Descreva o produto..."
                />
              </label>

              <div className="inventory-form-grid">
                <label>
                  Categoria
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    placeholder="Ex.: Informática"
                  />
                </label>

                <label>
                  Preço (R$)
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: Number(event.target.value) })
                    }
                  />
                </label>

                <label>
                  Quantidade
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({ ...form, quantity: Number(event.target.value) })
                    }
                  />
                </label>
              </div>

              {error && <p className="inventory-form-error">{error}</p>}

              <div className="inventory-modal-footer">
                <button
                  type="button"
                  className="inventory-cancel-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inventory-primary-btn"
                  disabled={saving}
                >
                  {saving ? "Salvando..." : "Salvar produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
