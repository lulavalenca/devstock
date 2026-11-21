
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/api";
import type { Product } from "../types/product";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
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
    }

    loadProducts();
  }, []);

  const stats = useMemo(() => ({
    totalProducts: products.length,
    totalUnits: products.reduce((sum, product) => sum + product.quantity, 0),
    totalValue: products.reduce(
      (sum, product) => sum + Number(product.price) * product.quantity,
      0
    ),
    lowStock: products.filter((product) => product.quantity <= 5).length,
  }), [products]);

  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <section>
      <h1>Dashboard Overview</h1>
      <p>Bem-vindo ao seu painel de gerenciamento de estoque.</p>

      <div className="stats-grid">
        <article className="stat-card purple">
          <span>Total de produtos</span>
          <strong>{stats.totalProducts}</strong>
        </article>

        <article className="stat-card blue">
          <span>Valor em estoque</span>
          <strong>{currency.format(stats.totalValue)}</strong>
        </article>

        <article className="stat-card cyan">
          <span>Unidades em estoque</span>
          <strong>{stats.totalUnits}</strong>
        </article>

        <article className="stat-card red">
          <span>Estoque baixo</span>
          <strong>{stats.lowStock}</strong>
        </article>
      </div>
    </section>
  );
}
