
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ChartNoAxesCombined,
  ShoppingCart,
  Truck,
  Settings,
  Boxes,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Inventário", icon: Package, path: "/inventory" },
  { label: "Analytics", icon: ChartNoAxesCombined, path: "/analytics" },
  { label: "Pedidos", icon: ShoppingCart, path: "/orders" },
  { label: "Fornecedores", icon: Truck, path: "/suppliers" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Boxes size={25} />
        </div>
        <span>DEVSTOCK</span>
      </div>

      <p className="sidebar-section">MENU PRINCIPAL</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.path}
              key={item.label}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>Configurações</span>
        </NavLink>

        <div className="sidebar-profile">
          <div className="profile-avatar">D</div>
          <div>
            <strong>DevStock Admin</strong>
            <small>Administrador</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
