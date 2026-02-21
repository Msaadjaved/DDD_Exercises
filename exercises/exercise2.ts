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

type Quantity = number & { readonly __brand: unique symbol }

function createQuantity(n: number): Quantity {
	if (!Number.isInteger(n)) {
		throw new Error("Quantity must be a whole number")
	}

	if (n <= 0) {
		throw new Error("Quantity must be positive")
	}

	if (n > 100) {
		throw new Error("Quantity exceeds maximum per order")
	}

	return n as Quantity
}

export function exercise2_PrimitiveQuantity() {
    type Order = {
        itemName: string
        quantity: Quantity
        pricePerUnit: number
    }

    // Demonstrate rejection of invalid quantities
    try {
        const _ : Order = {
            itemName: "Pizza",
            quantity: createQuantity(-3),
            pricePerUnit: 15,
        }
    } catch (error) {
        logError(2, "Invalid quantity rejected", {
            issue: (error as Error).message,
        })
    }

    // Valid order works fine
    const order: Order = {
        itemName: "Pizza",
        quantity: createQuantity(2),
        pricePerUnit: 15,
    }
    const total = order.quantity * order.pricePerUnit
    console.log("Valid order total:", total) // 30

    // Demonstrate rejection of absurd quantity
    try {
        const _: Order = {
            itemName: "Coffee",
            quantity: createQuantity(50000),
            pricePerUnit: 3,
        }
    } catch (error) {
        logError(2, "Bulk quantity rejected", {
            issue: (error as Error).message,
        })
    }
}
