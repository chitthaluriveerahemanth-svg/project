// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/*
 This file contains both the React component and embedded CSS for quick demos.
 For production, move the CSS to a dedicated .css/.module.css or Tailwind classes.
*/

// Small reusable components
const StatCard = ({ label, value, delta }) => (
  <div className="dash-stat-card" role="group" aria-label={label}>
    <p className="dash-stat-label">{label}</p>
    <p className="dash-stat-value">{value}</p>
    {typeof delta !== "undefined" && (
      <p className={`dash-stat-delta ${delta >= 0 ? "positive" : "negative"}`}>
        {delta >= 0 ? `+${delta}` : delta}
      </p>
    )}
    <div className="dash-stat-glow" />
  </div>
);

const ActivityList = ({ items }) => (
  <>
    <h3 className="dash-section-title">Recent activity</h3>
    {items.length === 0 ? (
      <p className="dash-muted">No recent activity.</p>
    ) : (
      <ul className="dash-activity-list">
        {items.map((it, idx) => (
          <li key={idx} className="dash-activity-item">
            <div>
              <p className="dash-activity-title">{it.title}</p>
              <p className="dash-activity-detail">{it.detail}</p>
            </div>
            <span className="dash-activity-time">{it.time}</span>
          </li>
        ))}
      </ul>
    )}
  </>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h4>{title}</h4>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      <button className="btn btn-ghost" onClick={onClose}>✕</button>
    </div>
  );
};

const RolePanels = {
  citizen: ({ onAction }) => (
    <div className="role-panel-content">
      <h3 className="dash-section-title">Citizen tools</h3>
      <ul className="dash-list">
        <li>Create and track issue reports.</li>
        <li>Give feedback on government services.</li>
        <li>Follow updates from your representatives.</li>
      </ul>
      <div className="dash-actions">
        <button className="btn btn-primary" onClick={() => onAction('create-issue')}>Create new issue</button>
        <button className="btn btn-outline" onClick={() => onAction('view-reports')}>View my reports</button>
      </div>
    </div>
  ),
  politician: ({ onAction }) => (
    <div className="role-panel-content">
      <h3 className="dash-section-title">Politician tools</h3>
      <ul className="dash-list">
        <li>See prioritized list of citizen concerns.</li>
        <li>Post status updates and responses.</li>
        <li>Monitor engagement and sentiment.</li>
      </ul>
      <div className="dash-actions">
        <button className="btn btn-primary" onClick={() => onAction('assign-issues')}>Assign issues</button>
        <button className="btn btn-outline" onClick={() => onAction('post-update')}>Post update</button>
      </div>
    </div>
  ),
  moderator: ({ onAction }) => (
    <div className="role-panel-content">
      <h3 className="dash-section-title">Moderator tools</h3>
      <ul className="dash-list">
        <li>Review flagged messages and issues.</li>
        <li>Mute or warn abusive users.</li>
        <li>Keep discussions respectful and on-topic.</li>
      </ul>
      <div className="dash-actions">
        <button className="btn btn-warning" onClick={() => onAction('review-flags')}>Review flags</button>
        <button className="btn btn-outline" onClick={() => onAction('guidelines')}>Community guidelines</button>
      </div>
    </div>
  ),
  admin: ({ onAction }) => (
    <div className="role-panel-content">
      <h3 className="dash-section-title">Admin tools</h3>
      <ul className="dash-list">
        <li>Manage platform users and roles.</li>
        <li>Configure categories and regions.</li>
        <li>Monitor overall platform health.</li>
      </ul>
      <div className="dash-actions">
        <button className="btn btn-danger" onClick={() => onAction('open-admin')}>Open admin panel</button>
        <button className="btn btn-outline" onClick={() => onAction('audit-logs')}>Audit logs</button>
      </div>
    </div>
  ),
};

// Hook that simulates fetching role-specific stats and activity. Replace with real API calls.
function useDashboardData(role) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Simulate async call
    const t = setTimeout(() => {
      if (!mounted) return;

      const today = new Date().toLocaleString();
      switch (role) {
        case "citizen":
          setStats([
            { label: "Issues created", value: 12, delta: 2 },
            { label: "Responses received", value: 4, delta: 1 },
            { label: "Open issues", value: 3, delta: -1 },
          ]);
          setActivity([
            { title: "Issue submitted", detail: "Road damage near Elm Street", time: today },
            { title: "Reply received", detail: "Councillor responded to your issue", time: today },
            { title: "Announcement", detail: "Town hall scheduled on Dec 15", time: today },
          ]);
          break;
        case "politician":
          setStats([
            { label: "Issues assigned", value: 48, delta: 5 },
            { label: "Resolved this week", value: 18, delta: 3 },
            { label: "Pending replies", value: 9, delta: -2 },
          ]);
          setActivity([
            { title: "New issue assigned", detail: "Water supply complaints in Ward 4", time: today },
            { title: "Citizen feedback", detail: "Positive rating on policy update", time: today },
            { title: "Moderator note", detail: "Thread in Ward 2 needs attention", time: today },
          ]);
          break;
        case "moderator":
          setStats([
            { label: "Flags today", value: 6, delta: 1 },
            { label: "Resolved conflicts", value: 22, delta: 2 },
            { label: "Active warnings", value: 1, delta: 0 },
          ]);
          setActivity([
            { title: "Flagged comment", detail: "Possible abusive language in thread", time: today },
            { title: "Conflict resolved", detail: "Rules clarified in housing thread", time: today },
            { title: "New report", detail: "Spam link posted in announcements", time: today },
          ]);
          break;
        case "admin":
          setStats([
            { label: "Total users", value: 1840, delta: 12 },
            { label: "Active roles", value: 5, delta: 0 },
            { label: "Open platform issues", value: 6, delta: -1 },
          ]);
          setActivity([
            { title: "New users registered", detail: "12 citizens, 2 politicians", time: today },
            { title: "Role updated", detail: "Moderator promoted to admin", time: today },
            { title: "System check", detail: "All services running normally", time: today },
          ]);
          break;
        default:
          setStats([
            { label: "Sessions", value: 0 },
            { label: "Actions", value: 0 },
            { label: "Notifications", value: 0 },
          ]);
          setActivity([]);
      }

      setLoading(false);
    }, 350);

    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [role]);

  const refresh = useCallback(() => {
    setLoading(true);
    // re-run effect logic: artificially change a stat to show dynamic update
    setTimeout(() => {
      setStats((s) => s.map((x) => ({ ...x, value: Math.max(0, x.value + (Math.random() > 0.5 ? 1 : -1)) })));
      setLoading(false);
    }, 300);
  }, []);

  return { loading, stats, activity, error, refresh };
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const role = user?.role || "guest";

  // Use the hook
  const { loading, stats, activity, refresh } = useDashboardData(role);

  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [panelVisible, setPanelVisible] = useState(true);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleAction = (action) => {
    switch (action) {
      case "create-issue":
        setModalOpen(true);
        break;
      case "view-reports":
        setToast("Opening reports (demo)");
        break;
      case "assign-issues":
        setToast("Assigning issues (demo)");
        break;
      case "post-update":
        setToast("Open post editor (demo)");
        break;
      case "review-flags":
        setToast("Navigating to flags queue");
        break;
      case "open-admin":
        setToast("Opening admin panel");
        break;
      default:
        setToast(`Action: ${action}`);
    }
  };

  const RolePanel = useMemo(() => RolePanels[role] ?? null, [role]);

  return (
    <div className="dash-page" aria-live="polite">
      <style>{`
        /* Basic layout */
        :root{--bg:#0f1724;--card:#0b1220;--muted:#9aa4b2;--accent:#5eead4;--glass:rgba(255,255,255,0.04)}
        .dash-page{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px; color:#e6eef6; background:linear-gradient(180deg,#071020 0%, #081426 100%); min-height:100vh}
        .dash-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .dash-title{font-size:1.6rem;margin:6px 0}
        .dash-welcome{color:var(--muted);margin:0}
        .dash-subtitle{color:var(--muted);font-size:0.95rem}
        .dash-role-pill{background:rgba(255,255,255,0.06);padding:4px 8px;border-radius:999px;font-weight:600}

        /* Stats grid */
        .dash-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px}
        .dash-stat-card{background:var(--glass);border-radius:12px;padding:14px;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(2,6,23,0.6);transition:transform .22s ease}
        .dash-stat-card:hover{transform:translateY(-6px)}
        .dash-stat-label{font-size:0.9rem;color:var(--muted);margin:0}
        .dash-stat-value{font-size:1.4rem;font-weight:700;margin:6px 0}
        .dash-stat-delta{font-size:0.85rem;margin:0}
        .dash-stat-delta.positive{color:#86efac}
        .dash-stat-delta.negative{color:#fca5a5}
        .dash-stat-glow{position:absolute;right:-40px;top:-40px;width:140px;height:140px;background:conic-gradient(from 180deg at 50% 50%, rgba(94,234,212,0.08), rgba(94,234,212,0.02));filter:blur(32px);transform:rotate(20deg)}

        /* Main layout */
        .dash-main{display:grid;grid-template-columns:1fr 360px;gap:16px}
        .dash-column{display:flex;flex-direction:column;gap:12px}
        .dash-card{background:var(--card);border-radius:12px;padding:14px;box-shadow:0 6px 18px rgba(2,6,23,0.6)}
        .dash-card-primary{min-height:200px;}
        .dash-section-title{margin:0 0 8px 0}
        .dash-list{margin:0;padding-left:20px}

        /* Buttons */
        .btn{background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px 12px;border-radius:10px;color:inherit;cursor:pointer;font-weight:600}
        .btn:hover{transform:translateY(-2px)}
        .btn:active{transform:translateY(0)}
        .btn:disabled{opacity:0.5;cursor:not-allowed}
        .btn-primary{background:linear-gradient(90deg,#06b6d4,#5eead4);color:#032;box-shadow:0 8px 18px rgba(6,182,212,0.08);border:0}
        .btn-outline{background:transparent;border:1px dashed rgba(255,255,255,0.06)}
        .btn-warning{background:linear-gradient(90deg,#fbbf24,#fb923c);color:#2b1a00;border:0}
        .btn-danger{background:linear-gradient(90deg,#ef4444,#f97316);color:#fff;border:0}
        .btn-ghost{background:transparent;border:0;padding:6px}

        /* Quick actions */
        .dash-quick-actions{display:flex;gap:8px;flex-wrap:wrap}

        /* Activity list */
        .dash-activity-list{list-style:none;margin:0;padding:0}
        .dash-activity-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.02)}
        .dash-activity-title{font-weight:700;margin:0}
        .dash-activity-detail{color:var(--muted);margin:6px 0 0 0}
        .dash-activity-time{font-size:0.8rem;color:var(--muted)}

        /* Modal */
        .modal-backdrop{position:fixed;inset:0;background:linear-gradient(180deg,rgba(3,6,23,0.6),rgba(3,6,23,0.8));display:flex;align-items:center;justify-content:center;z-index:60}
        .modal-card{background:#081226;padding:16px;border-radius:12px;min-width:320px;max-width:720px}
        .modal-header{display:flex;justify-content:space-between;align-items:center}
        .modal-body{margin-top:12px}

        /* Toast */
        .toast{position:fixed;right:20px;bottom:20px;background:linear-gradient(90deg,#111827,#0b1220);padding:10px 12px;border-radius:10px;display:flex;gap:8px;align-items:center;box-shadow:0 8px 30px rgba(2,6,23,0.6)}

        /* Small footer */
        .dash-footer{margin-top:16px;color:var(--muted);font-size:0.85rem}

        /* Role panel slide animations */
        .role-panel{transition:transform .36s cubic-bezier(.22,.9,.32,1),opacity .36s;transform-origin:left}
        .role-panel.hidden{transform:translateX(-18px);opacity:0}
        .role-panel.visible{transform:translateX(0);opacity:1}

        /* Responsive tweaks */
        @media (max-width:980px){
          .dash-main{grid-template-columns:1fr}
        }
      `}</style>

      <header className="dash-header">
        <div className="dash-header-left">
          <p className="dash-welcome">Dashboard</p>
          <h2 className="dash-title">Hello, <span>{user?.name ?? "Guest"}</span></h2>
          <p className="dash-subtitle">You are logged in as <span className="dash-role-pill">{role}</span></p>
        </div>

        <div className="dash-header-right">
          <div className="dash-header-controls">
            <button className="btn" onClick={() => setPanelVisible((v) => !v)} aria-pressed={panelVisible} title="Toggle panel visibility">
              {panelVisible ? 'Hide panel' : 'Show panel'}
            </button>
            <button className="btn" onClick={refresh} aria-label="Refresh dashboard" disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <section className="dash-stats-grid" aria-hidden={loading}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} delta={s.delta} />
        ))}
      </section>

      <main className="dash-main">
        <div className="dash-column">
          <div className="dash-card dash-card-primary">
            <div className={`role-panel ${panelVisible ? 'visible' : 'hidden'}`}>
              {RolePanel ? <RolePanel onAction={handleAction} /> : (
                <>
                  <h3 className="dash-section-title">Welcome</h3>
                  <p className="dash-muted">Choose an action from the right or contact an administrator if you need help.</p>
                </>
              )}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="dash-section-title">Quick actions</h3>
            <div className="dash-quick-actions">
              <button className="btn btn-primary" onClick={() => handleAction('create-issue')}>New report</button>
              <button className="btn btn-outline" onClick={() => handleAction('view-reports')}>Search issues</button>
              <button className="btn" onClick={() => handleAction('help')}>Help & docs</button>
            </div>
          </div>
        </div>

        <div className="dash-column">
          <div className="dash-card">
            <ActivityList items={activity} />
          </div>

          <div className="dash-card">
            <h3 className="dash-section-title">Notifications</h3>
            <p className="dash-muted">You have <strong>{stats.reduce((a, b) => a + (b.value || 0), 0)}</strong> items across these metrics.</p>
            <div style={{marginTop:12,display:'flex',gap:8}}>
              <button className="btn">View all notifications</button>
              <button className="btn btn-outline" onClick={() => setToast('Marked all as read')}>Mark all read</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="dash-footer">
        <p className="dash-muted">Last updated: {new Date().toLocaleString()}</p>
      </footer>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create new issue">
        <form onSubmit={(e) => {e.preventDefault(); setModalOpen(false); setToast('Issue created (demo)')}}>
          <label style={{display:'block',marginBottom:8}}>
            Title
            <input name="title" required style={{width:'100%',marginTop:6,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',background:'transparent',color:'inherit'}} />
          </label>
          <label style={{display:'block',marginBottom:8}}>
            Details
            <textarea name="detail" required rows={4} style={{width:'100%',marginTop:6,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',background:'transparent',color:'inherit'}} />
          </label>
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <button className="btn btn-outline" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>
      </Modal>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
};

export default Dashboard;
