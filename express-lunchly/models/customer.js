/** Customer model */

const db = require("../db");
const Reservation = require("./reservation");

class Customer {
  constructor({ id, first_name, last_name, phone, notes }) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.phone = phone || null;
    this._notes = notes || ""; // use hidden prop for getter/setter demo
  }

  /** Full name (getter) */                  // <-- CHANGED (Part Five)
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /** Notes getter/setter normalizes falsey to empty string (Further Study) */
  get notes() {
    return this._notes;
  }
  set notes(val) {
    this._notes = val ? String(val) : "";
  }

  /** Get all customers ordered by last, first */
  static async all() {
    const results = await db.query(
      `SELECT id, first_name, last_name, phone, notes
         FROM customers
         ORDER BY last_name, first_name`
    );
    return results.rows.map((r) => new Customer(r));
  }

  /** Get by id */
  static async get(id) {
    const result = await db.query(
      `SELECT id, first_name, last_name, phone, notes
         FROM customers
         WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }
    return new Customer(result.rows[0]);
  }

  /** Search by name (case-insensitive, partial) — Part Seven */
  static async searchByName(term) {
    const q = `%${term}%`;
    const result = await db.query(
      `SELECT id, first_name, last_name, phone, notes
         FROM customers
         WHERE first_name ILIKE $1 OR last_name ILIKE $1
         ORDER BY last_name, first_name`,
      [q]
    );
    return result.rows.map((r) => new Customer(r));
  }

  /** Top N customers by reservation count — Part Eight */
  static async bestCustomers(limit = 10) {
    const result = await db.query(
      `SELECT c.id, c.first_name, c.last_name, c.phone, c.notes,
              COUNT(r.id) AS res_count
         FROM customers AS c
         LEFT JOIN reservations AS r
           ON r.customer_id = c.id
        GROUP BY c.id
        ORDER BY res_count DESC, c.last_name, c.first_name
        LIMIT $1`,
      [limit]
    );
    // attach count for display convenience
    return result.rows.map((r) => {
      const cust = new Customer(r);
      cust.reservationCount = Number(r.res_count);
      return cust;
    });
  }

  /** Reservations for this customer */
  async getReservations() {
    return await Reservation.getForCustomer(this.id);
  }

  /** Insert or update */
  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers
            SET first_name=$1, last_name=$2, phone=$3, notes=$4
          WHERE id = $5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }
}

module.exports = Customer;