import { logError } from "./logger.js"

// ============================================================================
// EXERCISE 2: Primitive Obsession - The Quantity Disaster
//
// ANTI-PATTERN: Using a raw `number` for quantity. Accepts zero, negatives,
// floats (2.5 pizzas?), and absurd values (50,000 coffees).
//
// DDD FIX: Create a Quantity Value Object with domain constraints.
// Business rules belong INSIDE the type, not scattered across the codebase.
//
// HINT - Smart Constructor pattern:
//   type Quantity = number & { readonly __brand: unique symbol }
//   function createQuantity(n: number): Quantity {
//       if (!Number.isInteger(n)) throw new Error("Quantity must be a whole number")
//       if (n <= 0) throw new Error("Quantity must be positive")
//       if (n > 100) throw new Error("Quantity exceeds maximum per order")
//       return n as Quantity
//   }
//
// KEY INSIGHT: The upper bound (100) is a business rule, not an arbitrary
// limit. In DDD, domain experts define these constraints. Your code should
// make them explicit and impossible to bypass.
// ============================================================================


// ------------------------------------------------------------------
// 1. DEFINE THE DOMAIN TYPE (Branded Type)
// ------------------------------------------------------------------
// A 'Quantity' is a number, but not just ANY number.
type Quantity = number & { readonly __brand: unique symbol }


// ------------------------------------------------------------------
// 2. DEFINE THE SMART CONSTRUCTOR (Factory Function)
// ------------------------------------------------------------------
const createQuantity = (n: number): Quantity => {
    // Rule 1: Must be a whole number (no half-pizzas)
    if (!Number.isInteger(n)) {
        throw new Error(`[Domain Error] Quantity must be a whole number. Received: ${n}`)
    }

    // Rule 2: Must be positive (no negative orders)
    if (n <= 0) {
        throw new Error(`[Domain Error] Quantity must be positive. Received: ${n}`)
    }

    // Rule 3: Business Limit (anti-hoarding / mistake prevention)
    // This number (100) should ideally come from a config or constant.
    const MAX_QUANTITY = 100;
    if (n > MAX_QUANTITY) {
        throw new Error(`[Domain Error] Quantity ${n} exceeds maximum allowed (${MAX_QUANTITY}).`)
    }

    // If we pass the gauntlet, we bless the number as a Quantity.
    return n as Quantity
}

export function exercise2_PrimitiveQuantity() {
    type Order = {
        itemName: string
        quantity: Quantity
        pricePerUnit: number
    }

    // Invalid quantities — blocked at runtime, log stays empty
    try {
        const order: Order = {
            itemName: "Pizza",
            quantity: createQuantity(-3),
            pricePerUnit: 15,
        }
    } catch (_) {}

    try {
        const order: Order = {
            itemName: "Coffee",
            quantity: createQuantity(50000),
            pricePerUnit: 3,
        }
    } catch (_) {}

    // Valid order — no errors, no log entries
    const validOrder: Order = {
        itemName: "Coffee",
        quantity: createQuantity(5),
        pricePerUnit: 3,
    }

    const total = validOrder.quantity * validOrder.pricePerUnit
}