import { logError } from "./logger.js"

//============================================================================
// EXERCISE 5: The Identity Crisis - Order IDs
//
// ANTI-PATTERN: Using a plain `string` for an identifier. Nothing enforces
// format, non-emptiness, or uniqueness. Duplicate and empty IDs slip through.
//
// DDD FIX: Model identity as a dedicated Value Object with a controlled
// creation strategy. In DDD, the identity of an Entity is a first-class
// concept -- it deserves its own type.
//
// HINT - Branded type + factory:
//   type OrderId = string & { readonly __brand: unique symbol }
//
//   // Option A: Enforce a format (e.g., "ORD-" prefix + numeric)
//   function createOrderId(raw: string): OrderId {
//       if (!/^ORD-\d{5,}$/.test(raw))
//           throw new Error("OrderId must match ORD-XXXXX format")
//       return raw as OrderId
//   }
//
//   // Option B: Generate guaranteed-unique IDs (UUID-based)
//   function generateOrderId(): OrderId {
//       return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` as OrderId
//   }
//
// For uniqueness across a collection, use a Repository pattern: the
// Repository is responsible for ensuring no two Entities share an ID.
// This separates identity validation (Value Object) from uniqueness
// enforcement (Repository).
// ============================================================================

type OrderId = string & { readonly __brand: unique symbol }

const createOrderId = (raw: string): OrderId => {
    if (!/^ORD-\d{5,}$/.test(raw))
        throw new Error(`OrderId must match ORD-XXXXX format. Received: "${raw}"`)
    return raw as OrderId
}

const generateOrderId = (): OrderId => {
    return `ORD-${Date.now()}${Math.random().toString(36).slice(2, 7)}` as OrderId
}

// Repository enforces uniqueness
class OrderRepository {
    private ids = new Set<string>()

    register(id: OrderId): void {
        if (this.ids.has(id))
            throw new Error(`Duplicate OrderId detected: ${id}`)
        this.ids.add(id)
    }
}

export function exercise5_IdentityCrisis() {
    type Order = {
        orderId: OrderId
        customerName: string
        total: number
    }

    const repo = new OrderRepository()

    const invalidIds = ["", "12345", "12345", "not-a-number"]

    for (const raw of invalidIds) {
        try {
            const orderId = createOrderId(raw)
            repo.register(orderId)
        } catch (error: any) {
            logError(5, "Invalid Order ID rejected", { raw, issue: error.message })
        }
    }

    // Valid orders with generated IDs
    const orders: Order[] = [
        { orderId: generateOrderId(), customerName: "Alice", total: 25 },
        { orderId: generateOrderId(), customerName: "Bob", total: 30 },
    ]

    for (const order of orders) {
        repo.register(order.orderId)
    }
}