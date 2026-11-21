
import { useEffect, useState } from "react";
import {
  Bell,
  Moon,
  Sun,
  Package,
  Globe,
  Save,
  RotateCcw,
  Check,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import "./Settings.css";

type Preferences = {
  theme: "dark" | "light";
  language: string;
  currency: string;
  lowStockLimit: number;
  notifications: boolean;
  emailAlerts: boolean;
  compactMode: boolean;
};

const defaults: Preferences = {
  theme: "dark",
  language: "pt-BR",
  currency: "BRL",
  lowStockLimit: 5,
  notifications: true,
  emailAlerts: false,
  compactMode: false,
};

function loadSettings(): Preferences {
  try {
    const saved = localStorage.getItem("devstock-settings");
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<Preferences>(loadSettings);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    document.documentElement.dataset.settingsTheme = settings.theme;
  }, [settings.theme]);

  function update<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  }

  function saveSettings() {
    localStorage.setItem("devstock-settings", JSON.stringify(settings));
    setSavedMessage("Suas configurações foram salvas com sucesso!");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Deseja restaurar todas as configurações padrão?"
    );

    if (confirmed) {
      setSettings(defaults);
      localStorage.removeItem("devstock-settings");
      setSavedMessage("Configurações restauradas!");
      window.setTimeout(() => setSavedMessage(""), 3500);
    }
  }

  return (
    <div className={`settings-page ${settings.theme}`}>
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">PERSONALIZAÇÃO DO SISTEMA</span>
          <h1>Configurações</h1>
          <p>Personalize sua experiência e gerencie as preferências do DevStock.</p>
        </div>

        <div className="settings-header-icon">
          <SlidersHorizontal size={28} />
        </div>
      </header>

      {savedMessage && (
        <div className="settings-toast" role="status">
          <Check size={18} />
          {savedMessage}
        </div>
      )}

      <section className="settings-section">
        <div className="settings-section-title">
          <Palette size={20} />
          <div>
            <h2>Aparência</h2>
            <p>Personalize o visual do seu painel.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-icon purple">
              <Moon size={20} />
            </div>
            <div>
              <h3>Tema da interface</h3>
              <p>Escolha o estilo visual da página de configurações.</p>
            </div>
          </div>

          <div className="theme-options">
            <button
              className={`theme-option ${settings.theme === "dark" ? "selected" : ""}`}
              onClick={() => update("theme", "dark")}
              type="button"
            >
              <Moon size={18} />
              Escuro
              {settings.theme === "dark" && <Check size={16} />}
            </button>

            <button
              className={`theme-option ${settings.theme === "light" ? "selected" : ""}`}
              onClick={() => update("theme", "light")}
              type="button"
            >
              <Sun size={18} />
              Claro
              {settings.theme === "light" && <Check size={16} />}
            </button>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-icon blue">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3>Modo compacto</h3>
              <p>Reduz os espaçamentos para exibir mais informações.</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.compactMode}
            className={`settings-switch ${settings.compactMode ? "on" : ""}`}
            onClick={() => update("compactMode", !settings.compactMode)}
          >
            <span />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <Package size={20} />
          <div>
            <h2>Gerenciamento de estoque</h2>
            <p>Defina como o sistema deve acompanhar seus produtos.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-icon orange">
              <Package size={20} />
            </div>
            <div>
              <h3>Limite de estoque baixo</h3>
              <p>Quantidade mínima para considerar um produto com estoque baixo.</p>
            </div>
          </div>

          <div className="settings-number-control">
            <button
              type="button"
              aria-label="Diminuir limite"
              onClick={() =>
                update("lowStockLimit", Math.max(1, settings.lowStockLimit - 1))
              }
            >
              −
            </button>
            <strong>{settings.lowStockLimit}</strong>
            <button
              type="button"
              aria-label="Aumentar limite"
              onClick={() =>
                update("lowStockLimit", Math.min(100, settings.lowStockLimit + 1))
              }
            >
              +
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <Bell size={20} />
          <div>
            <h2>Notificações</h2>
            <p>Controle os avisos e alertas do sistema.</p>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-icon pink">
              <Bell size={20} />
            </div>
            <div>
              <h3>Notificações do sistema</h3>
              <p>Permitir avisos sobre atividades e atualizações.</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.notifications}
            className={`settings-switch ${settings.notifications ? "on" : ""}`}
            onClick={() => update("notifications", !settings.notifications)}
          >
            <span />
          </button>
        </div>

        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-icon green">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3>Alertas por e-mail</h3>
              <p>Preferência para receber alertas por e-mail futuramente.</p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.emailAlerts}
            className={`settings-switch ${settings.emailAlerts ? "on" : ""}`}
            onClick={() => update("emailAlerts", !settings.emailAlerts)}
          >
            <span />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-title">
          <Globe size={20} />
          <div>
            <h2>Preferências regionais</h2>
            <p>Configure idioma e moeda de exibição.</p>
          </div>
        </div>

        <div className="settings-card settings-select-card">
          <div>
            <h3>Idioma</h3>
            <p>Idioma preferencial da interface.</p>
          </div>
          <select
            value={settings.language}
            onChange={(event) => update("language", event.target.value)}
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="settings-card settings-select-card">
          <div>
            <h3>Moeda</h3>
            <p>Moeda preferencial para valores exibidos.</p>
          </div>
          <select
            value={settings.currency}
            onChange={(event) => update("currency", event.target.value)}
          >
            <option value="BRL">Real brasileiro (R$)</option>
            <option value="USD">Dólar americano ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </section>

      <footer className="settings-footer">
        <button
          className="settings-reset-button"
          type="button"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Restaurar padrões
        </button>

        <button
          className="settings-save-button"
          type="button"
          onClick={saveSettings}
        >
          <Save size={18} />
          Salvar configurações
        </button>
      </footer>
    </div>
  );
}
