import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import ProfitLoss from "./pages/ProfitLoss";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", background: "#f4f4f4" }}>
        <Link to="/">Dashboard</Link> |{" "}
        <Link to="/transactions">Transactions</Link> |{" "}
        <Link to="/pl">Profit/Loss</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/pl" element={<ProfitLoss />} />
      </Routes>
    </div>
  );
}
