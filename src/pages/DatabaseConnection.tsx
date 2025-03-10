import React, { useState } from "react";
import supabase from "../services/supabaseClient";

const DatabaseConnection = () => {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  const handleQuery = async () => {
    const { data, error } = await supabase
      .from("table_name") // Substitua "table_name" pelo nome real da sua tabela
      .select("*")
      .like("column_name", `%${query}%`); // Filtrando baseado na consulta

    if (error) {
      console.error("Erro na consulta:", error);
    } else {
      setData(data);
    }
  };

  return (
    <div>
      <h2>Conectar ao Banco de Dados</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar dados"
      />
      <button onClick={handleQuery}>Executar Query</button>

      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default DatabaseConnection;
