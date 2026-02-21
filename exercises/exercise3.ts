import { logError } from "./logger.js"

//============================================================================
// EXERCISE 3: String Confusion - Email vs Phone vs Name
//
// ANTI-PATTERN: Every field is `string`. TypeScript treats all strings as
// interchangeable, so you can put an email in the name field and a name in
// the email field with zero complaints. Empty strings also pass silently.
//
// DDD FIX: Use distinct Branded Types for each domain concept.
// Each type gets its own smart constructor with format-specific validation.
//
// HINT:
//   type Email = string & { readonly __brand: unique symbol }
//   type Phone = string & { readonly __brand: unique symbol }
//   type CustomerName = string & { readonly __brand: unique symbol }
//
//   function createEmail(s: string): Email {
//       if (!/^[^@]+@[^@]+\.[^@]+$/.test(s)) throw new Error("Invalid email")
//       return s as Email
//   }
//   function createPhone(s: string): Phone {
//       if (!/^\d[\d\-]{6,}$/.test(s)) throw new Error("Invalid phone")
//       return s as Phone
//   }
//   function createCustomerName(s: string): CustomerName {
//       if (s.trim().length === 0) throw new Error("Name cannot be empty")
//       return s.trim() as CustomerName
//   }
//
// Now `Customer` becomes:
//   type Customer = { name: CustomerName; email: Email; phone: Phone }
//
// Swapping fields is a COMPILE-TIME error: Email is not assignable to Phone.
// This is the core DDD idea: make illegal states unrepresentable.
// ============================================================================

type Email = string & { readonly __brand: unique symbol }
type Phone = string & { readonly __brand: unique symbol }
type CustomerName = string & { readonly __brand: unique symbol }

const createEmail = (s: string): Email => {
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(s)) throw new Error(`Invalid email: ${s}`)
    return s as Email
}

const createPhone = (s: string): Phone => {
    if (!/^\d[\d\-]{6,}$/.test(s)) throw new Error(`Invalid phone: ${s}`)
    return s as Phone
}

const createCustomerName = (s: string): CustomerName => {
    if (s.trim().length === 0) throw new Error("Name cannot be empty")
    return s.trim() as CustomerName
}

export function exercise3_StringConfusion() {
    type Customer = {
        name: CustomerName
        email: Email
        phone: Phone
    }

    // These are now COMPILE-TIME errors:
    // name: "john@example.com"  ❌ string not assignable to CustomerName
    // email: "John Doe"         ❌ string not assignable to Email
    // phone: "555-PIZZA"        ❌ string not assignable to Phone

    // Runtime protection — factory rejects invalid data
    try {
        const customer: Customer = {
            name: createCustomerName("john@example.com"),
            email: createEmail("John Doe"),
            phone: createPhone("555-PIZZA"),
        }
    } catch (error: any) {
        logError(3, "Fields mixed up - rejected by domain types", {
            issue: error.message,
        })
    }

    try {
        const emptyCustomer: Customer = {
            name: createCustomerName(""),
            email: createEmail(""),
            phone: createPhone(""),
        }
    } catch (error: any) {
        logError(3, "Empty strings rejected by domain types", {
            issue: error.message,
        })
    }

    // Valid customer
    const validCustomer: Customer = {
        name: createCustomerName("John Doe"),
        email: createEmail("john@example.com"),
        phone: createPhone("555-1234567"),
    }
}