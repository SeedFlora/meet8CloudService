type Level = 'info' | 'error'

/** Catat metadata aman saja; jangan kirim password, token, atau isi catatan. */
export function logEvent(level: Level, event: string, fields: Record<string, string | number> = {}) {
  const record = { timestamp: new Date().toISOString(), level, event, ...fields }
  const line = JSON.stringify(record)
  if (level === 'error') console.error(line)
  else console.info(line)
}
