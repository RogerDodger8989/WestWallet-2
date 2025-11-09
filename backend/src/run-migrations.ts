import AppDataSource from './data-source';

async function run() {
  try {
    await AppDataSource.initialize();
    console.log('[migrate] DataSource initialized');
    const result = await AppDataSource.runMigrations();
    result.forEach(r => console.log(`[migrate] ${r.name}`));
    await AppDataSource.destroy();
    console.log('[migrate] Done');
  } catch (err) {
    console.error('[migrate] Failed:', err);
    process.exit(1);
  }
}

run();
