import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/database-connection">Conectar Banco de Dados</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
