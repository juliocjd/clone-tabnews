import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const dataBaseVersionResult = await database.query("show server_version;");
  const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

  const databaseMaxConnectResult = await database.query(
    "Show max_connections;",
  );
  const databaseMaxConnectValue =
    databaseMaxConnectResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB; // capturando da variável de ambiente o nome do DB
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  //"SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
  const databaseOpenedConnectionValue =
    databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: dataBaseVersionValue,
        max_connections: parseInt(databaseMaxConnectValue),
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;
