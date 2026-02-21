import { logError } from "./logger.js"

//============================================================================
// EXERCISE 7: Currency Confusion
//
// ANTI-PATTERN: Using a raw `number` for money without specifying the unit.
// Is 1850 dollars or cents? When two developers use different conventions,
// adding their values produces nonsense.
//
// DDD FIX: Create a Money Value Object that pairs amount with currency/unit.
// In DDD, a Value Object is defined by its attributes and has no identity.
// Money is a textbook example -- $10 is $10 regardless of which bill it is.
//
// HINT - Money Value Object:
//   type Currency = "USD" | "EUR" | "GBP"
//
//   class Money {
//       private constructor(
//           private readonly cents: number, // always stored in smallest unit
//           public readonly currency: Currency,
//       ) {}
//
//       static fromDollars(amount: number, currency: Currency): Money {
//           return new Money(Math.round(amount * 100), currency)
//       }
//       static fromCents(cents: number, currency: Currency): Money {
//           if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
//           return new Money(cents, currency)
//       }
//
//       add(other: Money): Money {
//           if (this.currency !== other.currency)
//               throw new Error("Cannot add different currencies")
//           return new Money(this.cents + other.cents, this.currency)
//       }
//
//       format(): string {
//           return `$${(this.cents / 100).toFixed(2)}`
//       }
//   }
//
// KEY INSIGHT: By storing everything in cents (smallest unit), you avoid
// floating-point issues. The type system prevents mixing currencies, and
// the single representation eliminates dollars-vs-cents ambiguity.
// ============================================================================

type Currency = "USD" | "EUR" | "GBP"

class Money {
    private constructor(
        private readonly cents: number,
        public readonly currency: Currency,
    ) {}

    static fromDollars(amount: number, currency: Currency): Money {
        return new Money(Math.round(amount * 100), currency)
    }

    static fromCents(cents: number, currency: Currency): Money {
        if (!Number.isInteger(cents)) throw new Error("Cents must be integer")
        return new Money(cents, currency)
    }

    add(other: Money): Money {
        if (this.currency !== other.currency)
            throw new Error(`Cannot add different currencies: ${this.currency} and ${other.currency}`)
        return new Money(this.cents + other.cents, this.currency)
    }

    format(): string {
        return `$${(this.cents / 100).toFixed(2)} ${this.currency}`
    }
}

export function exercise7_CurrencyConfusion() {
    type MenuItem = {
        name: string
        price: Money
    }

    // Mixed currency — blocked at runtime
    try {
        const a = Money.fromDollars(10, "USD")
        const b = Money.fromDollars(10, "EUR")
        a.add(b)
    } catch (error: any) {
        logError(7, "Cannot add different currencies", { issue: error.message })
    }

    // Valid — canonical cents representation eliminates ambiguity
    const burger: MenuItem = { name: "Burger", price: Money.fromDollars(12.50, "USD") }
    const pizza: MenuItem  = { name: "Pizza",  price: Money.fromDollars(18.50, "USD") }

    const total = burger.price.add(pizza.price)
    console.log(`Total: ${total.format()}`) // $31.00 USD
}