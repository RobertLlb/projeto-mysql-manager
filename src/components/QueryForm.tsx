import React, { useState } from "react";

const QueryForm = ({ onExecute }: { onExecute: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecute(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite sua query SQL aqui"
      />
      <button type="submit">Executar</button>
    </form>
  );
};

export default QueryForm;
