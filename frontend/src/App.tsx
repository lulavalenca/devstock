
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import { getProducts } from "./services/api";
import type { Product } from "./types/product";
import "./App.css";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar os produtos."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  const totalProducts = products.length;

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const totalValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity <= 5
  ).length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>
              Bem-vindo ao seu painel de gerenciamento de estoque.
            </p>
          </div>

          <div className="header-status">
            <span className="status-dot"></span>
            Sistema operacional
          </div>
        </header>

        <section className="welcome-card">
          <div>
            <span className="welcome-label">
              DEVSTOCK MANAGEMENT
            </span>

            <h2>Controle seu estoque com inteligência.</h2>

            <p>
              Gerencie produtos, acompanhe indicadores e tenha
              uma visão completa da sua operação.
            </p>
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card purple">
            <span>Total de produtos</span>
            <strong>{loading ? "..." : totalProducts}</strong>
            <small>Produtos cadastrados</small>
          </article>

          <article className="stat-card blue">
            <span>Valor em estoque</span>
            <strong>
              {loading ? "..." : formatCurrency(totalValue)}
            </strong>
            <small>Valor total dos produtos</small>
          </article>

          <article className="stat-card cyan">
            <span>Unidades em estoque</span>
            <strong>{loading ? "..." : totalUnits}</strong>
            <small>Quantidade total disponível</small>
          </article>

          <article className="stat-card red">
            <span>Estoque baixo</span>
            <strong>{loading ? "..." : lowStock}</strong>
            <small>Produtos com até 5 unidades</small>
          </article>
        </section>

        <section className="products-section">
          <div className="section-heading">
            <div>
              <h2>Produtos cadastrados</h2>
              <p>Gerencie e acompanhe seus produtos.</p>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Buscar produto ou categoria..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading && (
            <p className="feedback-message">
              Carregando produtos...
            </p>
          )}

          {error && (
            <p className="error-message">{error}</p>
          )}

          {!loading && !error && (
            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-name">
                        {product.name}
                      </td>

                      <td>{product.category}</td>

                      <td>
                        {formatCurrency(Number(product.price))}
                      </td>

                      <td>{product.quantity}</td>

                      <td>
                        <span
                          className={
                            product.quantity <= 5
                              ? "stock-badge low"
                              : "stock-badge available"
                          }
                        >
                          {product.quantity <= 5
                            ? "Estoque baixo"
                            : "Disponível"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <p className="feedback-message">
                  Nenhum produto encontrado.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
