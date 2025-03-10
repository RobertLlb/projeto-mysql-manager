import { useState, useEffect } from "react";

interface DatabaseConnection {
  host: string;
  user: string;
  password: string;
  dbName: string;
}

const useDatabase = () => {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);

  const connect = (credentials: DatabaseConnection) => {
    // Aqui você faria a conexão com o banco de dados
    setConnection(credentials);
  };

  return { connection, connect };
};

export default useDatabase;
