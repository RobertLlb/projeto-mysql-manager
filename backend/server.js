require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuração do CORS
app.use(
  cors()
);

app.use(express.json());

// Função para conectar ao MySQL
const connectDB = (config) => {
  return mysql.createConnection(config);
};

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor" });
});

// 🔹 Rota para buscar todas as tabelas e colunas do banco
app.post("/schema", (req, res) => {
  const { host, user, password, database } = req.body;
  const db = connectDB({ host, user, password, database });

  const query = `
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
    FROM information_schema.columns 
    WHERE TABLE_SCHEMA = ?`;

  db.query(query, [database], (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao buscar schema:", err);
      return res.status(500).json({ error: "Erro ao buscar schema" });
    }
    res.json(results);
  });
});

// 🔹 Rota para buscar dados de uma tabela
app.post("/data", (req, res) => {
  const { host, user, password, database, table } = req.body;
  const db = connectDB({ host, user, password, database });

  const query = `SELECT * FROM ${table}`;
  db.query(query, (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao buscar dados:", err);
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
    res.json(results);
  });
});

// 🔹 Rota para executar comandos SQL personalizados
app.post("/execute-sql", (req, res) => {
  const { host, user, password, database, sql } = req.body;
  const db = connectDB({ host, user, password, database });

  db.query(sql, (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao executar SQL:", err);
      return res.status(500).json({ error: "Erro ao executar SQL" });
    }
    res.json(results);
  });
});

// 🔹 Rota para inserir dados em uma tabela
app.post("/insert", (req, res) => {
  const { host, user, password, database, table, data } = req.body;
  const db = connectDB({ host, user, password, database });

  const columns = Object.keys(data).join(", ");
  const values = Object.values(data);
  const placeholders = values.map(() => "?").join(", ");

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

  db.query(query, values, (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao inserir dados:", err);
      return res.status(500).json({ error: "Erro ao inserir dados" });
    }
    res.json({ message: "Registro inserido", results });
  });
});

// 🔹 Rota para atualizar um registro
app.put("/update", (req, res) => {
  const { host, user, password, database, table, id, data } = req.body;
  const db = connectDB({ host, user, password, database });

  const updates = Object.keys(data).map((key) => `${key} = ?`).join(", ");
  const values = [...Object.values(data), id];

  const query = `UPDATE ${table} SET ${updates} WHERE id = ?`;

  db.query(query, values, (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao atualizar:", err);
      return res.status(500).json({ error: "Erro ao atualizar" });
    }
    res.json({ message: "Registro atualizado", results });
  });
});

// 🔹 Rota para deletar um registro
app.delete("/delete", (req, res) => {
  const { host, user, password, database, table, id } = req.body;
  const db = connectDB({ host, user, password, database });

  const query = `DELETE FROM ${table} WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao deletar:", err);
      return res.status(500).json({ error: "Erro ao deletar" });
    }
    res.json({ message: "Registro deletado", results });
  });
});

// 🔹 Rota para criar uma nova tabela
app.post("/create-table", (req, res) => {
  const { host, user, password, database, tableName, columns } = req.body;
  const db = connectDB({ host, user, password, database });

  const columnDefinitions = columns.map((col) => `${col.name} ${col.type}`).join(", ");
  const query = `CREATE TABLE ${tableName} (${columnDefinitions})`;

  db.query(query, (err, results) => {
    db.end();
    if (err) {
      console.error("Erro ao criar tabela:", err);
      return res.status(500).json({ error: "Erro ao criar tabela" });
    }
    res.json({ message: "Tabela criada", results });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));