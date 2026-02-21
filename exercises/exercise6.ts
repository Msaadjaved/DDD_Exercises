import { logError } from "./logger.js"

//============================================================================
// EXERCISE 6: Temporal Logic Error - Operating Hours
//
// ANTI-PATTERN: Representing domain-specific time concepts as raw numbers.
// Two problems: (1) invalid values (25, -5) are accepted, and (2) the
// business logic for "is the restaurant open?" is wrong for overnight spans.
//
// DDD FIX: Encapsulate the concept of "operating hours" in a Value Object
// that owns its own validation AND its own logic.
//
// HINT - Value Object with behavior:
//   type Hour = number & { readonly __brand: unique symbol }
//   function createHour(h: number): Hour {
//       if (!Number.isInteger(h) || h < 0 || h > 23)
//           throw new Error("Hour must be 0-23")
//       return h as Hour
//   }
//
//   class OperatingHours {
//       private constructor(
//           public readonly opens: Hour,
//           public readonly closes: Hour,
//       ) {}
//
//       static create(opens: number, closes: number): OperatingHours {
//           return new OperatingHours(createHour(opens), createHour(closes))
//       }
//
//       isOpenAt(hour: Hour): boolean {
//           // Handles midnight crossover correctly
//           if (this.opens <= this.closes) {
//               return hour >= this.opens && hour < this.closes
//           }
//           return hour >= this.opens || hour < this.closes
//       }
//   }
//
// KEY INSIGHT: In DDD, domain logic lives inside the domain objects, not in
// external utility functions. OperatingHours knows how to answer "am I open?"
// because that question is part of its domain responsibility.
// ============================================================================

type Hour = number & { readonly __brand: unique symbol }

const createHour = (h: number): Hour => {
    if (!Number.isInteger(h) || h < 0 || h > 23)
        throw new Error(`Hour must be 0-23. Received: ${h}`)
    return h as Hour
}

class OperatingHours {
    private constructor(
        public readonly opens: Hour,
        public readonly closes: Hour,
    ) {}

    static create(opens: number, closes: number): OperatingHours {
        return new OperatingHours(createHour(opens), createHour(closes))
    }

    isOpenAt(hour: Hour): boolean {
        if (this.opens <= this.closes) {
            return hour >= this.opens && hour < this.closes
        }
        // Handles midnight crossover
        return hour >= this.opens || hour < this.closes
    }
}

export function exercise6_TemporalLogic() {
    // Invalid hours — blocked at runtime
    try {
        OperatingHours.create(25, -5)
    } catch (error: any) {
        logError(6, "Invalid hours accepted without validation", {
            issue: error.message,
        })
    }

    // Valid overnight restaurant — logic now correct
    const hours = OperatingHours.create(22, 6)
    const testHour = createHour(2)
    const isOpen = hours.isOpenAt(testHour)

    // No longer broken — 2 AM correctly returns true
    if (!isOpen) {
        logError(6, "Operating hours logic broken for overnight restaurants", {
            issue: "2 AM should be open for a 10PM-6AM restaurant!",
        })
    }
}