// =============================================================================
// /js/cart.js — Cart state (no DOM)
// =============================================================================
// localStorage-backed cart. Key: tibnz_cart_v1
//
// Line shape: { sku: string, qty: number }
//
// Exports:
//   getLines()           → [{ sku, qty }]
//   addItem(sku, qty?)   — increments if SKU already present
//   setQty(sku, qty)     — qty <= 0 removes the line
//   removeLine(sku)
//   clear()
//   getCount()           → total quantity (for nav badge)
//   expandToProductIds() → flat string[] with bundles + quantities expanded
//   subscribe(fn)        — fn called on every change; returns unsubscribe fn
// =============================================================================

import { PRODUCTS, BUNDLES, resolveSkuToItems } from './shipping.js';

const STORAGE_KEY = 'tibnz_cart_v1';
let lines = load();
const listeners = new Set();

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate: only keep lines with known SKUs and positive qty
    return parsed.filter(
      l => l && typeof l.sku === 'string' &&
           typeof l.qty === 'number' && l.qty > 0 &&
           (PRODUCTS[l.sku] || BUNDLES[l.sku])
    );
  } catch (_) {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch (_) { /* storage full — ignore */ }
}

function notify() {
  const event = new CustomEvent('cart:change', { detail: { lines } });
  window.dispatchEvent(event);
  listeners.forEach(fn => fn(lines));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getLines() {
  return lines.slice();
}

export function addItem(sku, qty = 1) {
  if (!PRODUCTS[sku] && !BUNDLES[sku]) {
    console.warn(`cart.addItem: unknown SKU "${sku}"`);
    return;
  }
  const existing = lines.find(l => l.sku === sku);
  if (existing) {
    existing.qty += qty;
  } else {
    lines.push({ sku, qty });
  }
  save();
  notify();
}

export function setQty(sku, qty) {
  if (qty <= 0) {
    removeLine(sku);
    return;
  }
  const existing = lines.find(l => l.sku === sku);
  if (existing) {
    existing.qty = qty;
    save();
    notify();
  }
}

export function removeLine(sku) {
  const before = lines.length;
  lines = lines.filter(l => l.sku !== sku);
  if (lines.length !== before) {
    save();
    notify();
  }
}

export function clear() {
  lines = [];
  save();
  notify();
}

export function getCount() {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

// Flat array of product IDs with bundles and quantities expanded.
// This is what feeds calculateShipping() and the API.
export function expandToProductIds() {
  const result = [];
  for (const { sku, qty } of lines) {
    const ids = resolveSkuToItems(sku);
    for (let i = 0; i < qty; i++) {
      result.push(...ids);
    }
  }
  return result;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
