
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
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inventário", icon: Package },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Pedidos", icon: ShoppingCart },
  { label: "Fornecedores", icon: Truck },
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
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              href="#"
              key={item.label}
              className={`sidebar-link ${index === 0 ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <a href="#" className="sidebar-link">
          <Settings size={19} />
          <span>Configurações</span>
        </a>

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
