import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

// Componente Modal
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-4 rounded w-11/12 md:w-1/2">
        {children}
        <button
          className="w-full p-2 bg-red-600 hover:bg-red-700 rounded text-white mt-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Componente Pagination
const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center mt-4">
      {pages.map((page) => (
        <button
          key={page}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === page ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => paginate(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

// Componente SearchBar
const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white mb-4"
    />
  );
};

const SchemaVisualizer = () => {
  const { user } = useAuth();
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [newRow, setNewRow] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSQLModalOpen, setIsSQLModalOpen] = useState(false);

  useEffect(() => {
    fetchDatabases();
  }, []);

  const fetchDatabases = async () => {
    const { data, error } = await supabase
      .from("mysql_connections")
      .select("*")
      .eq("user_id", user?.id);
    if (error) return setAlert(error.message);
    setDatabases(data || []);
  };

  const fetchTables = async (database) => {
    setLoading(true);
    const db = databases.find((db) => db.name === database);
    if (!db) return;

    const response = await fetch("http://localhost:5000/schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database,
      }),
    });
    const data = await response.json();
    const uniqueTables = [...new Set(data.map((item) => item.TABLE_NAME))];
    setTables(uniqueTables);
    setLoading(false);
  };

  const fetchColumnsAndRows = async (table) => {
    setLoading(true);
    const db = databases.find((db) => db.name === selectedDatabase);
    if (!db) return;

    const response = await fetch("http://localhost:5000/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database,
        table,
      }),
    });
    const data = await response.json();
    if (data.length > 0) {
      setColumns(Object.keys(data[0]));
      setRows(data);
    } else {
      setColumns([]);
      setRows([]);
    }
    setLoading(false);
  };

  const executeSQL = async () => {
    setLoading(true);
    const db = databases.find((db) => db.name === selectedDatabase);
    if (!db) return;

    const response = await fetch("http://localhost:5000/execute-sql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database,
        sql: sqlQuery,
      }),
    });
    const data = await response.json();
    if (data.length > 0) {
      setColumns(Object.keys(data[0]));
      setRows(data);
    } else {
      setColumns([]);
      setRows([]);
    }
    setLoading(false);
    setIsSQLModalOpen(false);
  };

  const handleEdit = (row) => {
    setEditingRow(row);
  };

  const saveEdit = async () => {
    setLoading(true);
    const db = databases.find((db) => db.name === selectedDatabase);
    if (!db) return;

    const response = await fetch("http://localhost:5000/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database,
        table: selectedTable,
        id: editingRow.id,
        data: editingRow,
      }),
    });
    const data = await response.json();
    if (data.message === "Registro atualizado") {
      fetchColumnsAndRows(selectedTable);
      setEditingRow(null);
    }
    setLoading(false);
  };

  const addNewRow = async () => {
    setLoading(true);
    const db = databases.find((db) => db.name === selectedDatabase);
    if (!db) return;

    const response = await fetch("http://localhost:5000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: db.host,
        user: db.username,
        password: db.password,
        database: db.database,
        table: selectedTable,
        data: newRow,
      }),
    });
    const data = await response.json();
    if (data.message === "Registro inserido") {
      fetchColumnsAndRows(selectedTable);
      setNewRow({});
    }
    setLoading(false);
  };

  // Filtro de busca
  const filteredRows = rows.filter((row) =>
    columns.some((col) =>
      String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Paginação
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 space-y-4 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold">Database Schema Visualizer</h1>

      <select
        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
        onChange={(e) => {
          setSelectedDatabase(e.target.value);
          fetchTables(e.target.value);
        }}
      >
        <option value="">Select Database</option>
        {databases.map((db) => (
          <option key={db.id} value={db.name} className="text-black">
            {db.name}
          </option>
        ))}
      </select>

      {tables.length > 0 && (
        <select
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
          onChange={(e) => {
            setSelectedTable(e.target.value);
            fetchColumnsAndRows(e.target.value);
          }}
        >
          <option value="">Select Table</option>
          {tables.map((table) => (
            <option key={table} value={table} className="text-black">
              {table}
            </option>
          ))}
        </select>
      )}

      {selectedTable && (
        <div>
          <h2 className="text-lg font-bold mt-4">Table: {selectedTable}</h2>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 mt-4 text-sm">
              <thead>
                <tr className="bg-gray-700">
                  {columns.map((col) => (
                    <th key={col} className="border border-gray-600 p-2">
                      {col}
                    </th>
                  ))}
                  <th className="border border-gray-600 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, index) => (
                  <tr key={index} className="bg-gray-800">
                    {columns.map((col) => (
                      <td key={col} className="border border-gray-600 p-2">
                        {row[col]}
                      </td>
                    ))}
                    <td className="border border-gray-600 p-2">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRows.length / rowsPerPage)}
            paginate={paginate}
          />
        </div>
      )}

      {/* Modal para SQL */}
      <Modal isOpen={isSQLModalOpen} onClose={() => setIsSQLModalOpen(false)}>
        <h2 className="text-lg font-bold">Execute SQL Query</h2>
        <textarea
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white mb-2"
          placeholder="Type SQL Query..."
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          onClick={executeSQL}
        >
          Execute
        </button>
      </Modal>

      {/* Botão para abrir o modal de SQL */}
      <button
        className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        onClick={() => setIsSQLModalOpen(true)}
      >
        Open SQL Editor
      </button>
    </div>
  );
};

export default SchemaVisualizer;