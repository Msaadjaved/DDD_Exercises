import { logError } from "./logger.js"

//============================================================================
// EXERCISE 4: Business Rule Violation - Table Capacity
//
// ANTI-PATTERN: Using a plain data structure (anemic type) with no
// invariant enforcement. Nothing prevents currentGuests > capacity or
// negative guest counts. The type is just a bag of numbers.
//
// DDD FIX: Use an Entity with enforced invariants.
// Unlike Value Objects (which are defined by their value), an Entity has
// a unique identity (tableNumber) and a lifecycle. Invariants (business
// rules that must ALWAYS be true) are enforced in the constructor and
// in every method that mutates state.
//
// HINT - Entity with private constructor:
//   class Table {
//       private constructor(
//           public readonly tableNumber: number,
//           public readonly capacity: number,
//           private _currentGuests: number,
//       ) {}
//
//       static create(tableNumber: number, capacity: number): Table {
//           if (capacity <= 0) throw new Error("Capacity must be positive")
//           return new Table(tableNumber, capacity, 0)
//       }
//
//       get currentGuests(): number { return this._currentGuests }
//
//       seatGuests(count: number): void {
//           if (count <= 0) throw new Error("Guest count must be positive")
//           if (this._currentGuests + count > this.capacity)
//               throw new Error("Exceeds table capacity")
//           this._currentGuests += count
//       }
//   }
//
// KEY INSIGHT: The invariant (guests <= capacity) is enforced by the Entity
// itself. External code cannot put the Entity into an invalid state because
// there is no public way to set _currentGuests directly.
// ============================================================================

class Table {
    private constructor(
        public readonly tableNumber: number,
        public readonly capacity: number,
        private _currentGuests: number,
    ) {}

    static create(tableNumber: number, capacity: number): Table {
        if (capacity <= 0) throw new Error("Capacity must be positive")
        return new Table(tableNumber, capacity, 0)
    }

    get currentGuests(): number { return this._currentGuests }

    seatGuests(count: number): void {
        if (count <= 0) throw new Error("Guest count must be positive")
        if (this._currentGuests + count > this.capacity)
            throw new Error(`Exceeds table capacity. Capacity: ${this.capacity}, Current: ${this._currentGuests}, Requested: ${count}`)
        this._currentGuests += count
    }
}

export function exercise4_BusinessRuleViolation() {
    // Overcapacity — blocked at runtime
    try {
        const table = Table.create(5, 4)
        table.seatGuests(7) // throws — exceeds capacity
    } catch (error: any) {
        logError(4, "Table overcapacity - business rule violated", {
            issue: error.message,
        })
    }

    // Negative guests — blocked at runtime
    try {
        const table = Table.create(3, 6)
        table.seatGuests(-2) // throws — negative guests
    } catch (error: any) {
        logError(4, "Negative guest count - impossible in real world", {
            issue: error.message,
        })
    }

    // Valid seating
    const table = Table.create(1, 4)
    table.seatGuests(2)
    table.seatGuests(2)
}