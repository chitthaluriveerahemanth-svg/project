import React from "react";
import "./auth.css";

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
    <div className="auth-bg" />
  </div>
);

export default AuthLayout;
