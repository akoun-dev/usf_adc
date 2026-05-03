const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, 'supabase', 'migrations');

const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL
};

// ----------- UTIL PARSING -----------

function extractTableName(sql) {
  const match = sql.match(/create table\s+([^\s(]+)/i);
  return match ? match[1].replace(/"/g, '') : null;
}

function extractDependencies(sql) {
  const matches = [...sql.matchAll(/references\s+([^\s(]+)/gi)];
  return matches.map(m => m[1].replace(/"/g, ''));
}

function detectType(sql) {
  if (/create table/i.test(sql)) return 'table';
  if (/create.*function/i.test(sql)) return 'function';
  if (/create.*trigger/i.test(sql)) return 'trigger';
  if (/policy/i.test(sql)) return 'policy';
  return 'other';
}

// ----------- LOAD FILES -----------

function loadMigrations() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'));

  return files.map(file => {
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');

    return {
      file,
      sql,
      type: detectType(sql),
      table: extractTableName(sql),
      deps: extractDependencies(sql)
    };
  });
}

// ----------- GRAPH + TOPO SORT -----------

function topoSort(migrations) {
  const graph = new Map();

  migrations.forEach(m => {
    if (m.table) {
      graph.set(m.table, m.deps);
    }
  });

  const visited = new Set();
  const result = [];

  function visit(node, stack = []) {
    if (stack.includes(node)) {
      throw new Error(`❌ Dépendance circulaire: ${stack.join(' -> ')} -> ${node}`);
    }

    if (!visited.has(node)) {
      stack.push(node);

      const deps = graph.get(node) || [];
      deps.forEach(dep => visit(dep, stack));

      stack.pop();
      visited.add(node);
      result.push(node);
    }
  }

  [...graph.keys()].forEach(node => visit(node));

  return result;
}

// ----------- TRI GLOBAL -----------

function smartSort(migrations) {
  const tables = migrations.filter(m => m.type === 'table');
  const others = migrations.filter(m => m.type !== 'table');

  const order = topoSort(tables);

  const sortedTables = order.map(name =>
    tables.find(t => t.table === name)
  );

  const functions = others.filter(m => m.type === 'function');
  const triggers = others.filter(m => m.type === 'trigger');
  const policies = others.filter(m => m.type === 'policy');
  const rest = others.filter(m => m.type === 'other');

  return [
    ...sortedTables,
    ...functions,
    ...triggers,
    ...policies,
    ...rest
  ];
}

// ----------- EXECUTION -----------

async function run() {
  const client = new Client(DB_CONFIG);
  await client.connect();

  try {
    console.log("🚀 Début migration intelligente...\n");

    const migrations = loadMigrations();
    const sorted = smartSort(migrations);

    await client.query('BEGIN');

    for (const m of sorted) {
      console.log(`➡️ ${m.file} (${m.type})`);

      await client.query(m.sql);

      console.log(`✅ OK`);
    }

    await client.query('COMMIT');
    console.log("\n🎉 Migration terminée avec succès !");
  } catch (err) {
    console.error("\n❌ ERREUR → rollback automatique");
    console.error(err.message);

    await client.query('ROLLBACK');
  } finally {
    await client.end();
  }
}

run();


// command : node runMigrations.js