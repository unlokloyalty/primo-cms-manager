import { writable, readable, derived, get } from 'svelte/store';
import { find, some } from 'lodash'
import {site} from '../index'

const store = writable([])

let symbols
store.subscribe(s => {
  symbols = s
  if (site) site.save({ symbols })
})

const actions = {
  reload: async () => {
    return symbols
  },
  add: (symbol) => {
    store.set([ symbol, ...symbols ])
  },
  place: (symbol) => {
    // store.set([ symbol, ...symbols ])
    const exists = some(symbols, ['id',symbol.id])
    if (exists) {
      actions.modify(symbol)
    } else {
      actions.add(symbol)
    }
  },
  modify: (symbol) => {
    const newLibrary = symbols.map(s => s.id === symbol.id ? symbol : s)
    store.set(newLibrary)
  },
  remove: (symbolID) => {
    const newLibrary = symbols.filter(s => s.id !== symbolID)
    store.set(newLibrary)
  },
  get: (symbolID) => find(symbols, ['id', symbolID]),
  subscribe: store.subscribe,
  set: store.set
}


export default actions