const SAFE_KEY = "nabhacare-mock-store"

function getStore() {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(SAFE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setStore(store) {
  if (typeof window === "undefined") return
  localStorage.setItem(SAFE_KEY, JSON.stringify(store))
}

export function readCollection(name, fallback = []) {
  const store = getStore()
  return Array.isArray(store[name]) ? store[name] : fallback
}

export function writeCollection(name, items) {
  const store = getStore()
  store[name] = items
  setStore(store)
}

export function upsertItem(name, item, idField = "id") {
  const items = readCollection(name, [])
  const idx = items.findIndex((x) => x[idField] === item[idField])
  if (idx >= 0) items[idx] = item
  else items.push(item)
  writeCollection(name, items)
  return item
}

export function deleteItem(name, id, idField = "id") {
  const items = readCollection(name, [])
  writeCollection(name, items.filter((x) => x[idField] !== id))
}

export function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}


