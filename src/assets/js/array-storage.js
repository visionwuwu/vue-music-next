import storage from 'good-storage'

function insertArray(item, items, compare) {
  const index = compare(items)
  if (index > -1) {
    return
  }
  items.unshift(item)
}

function removeItemInArray(items, compare) {
  const index = compare(items)
  if (index > -1) {
    items.splice(index, 1)
  }
}

export function save(item, key, compare) {
  const items = storage.get(key, [])
  insertArray(item, items, compare)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  removeItemInArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}
