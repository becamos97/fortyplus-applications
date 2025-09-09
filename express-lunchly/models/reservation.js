/** Reservation model */

const db = require("../db");

class Reservation {
  constructor({ id, customer_id, start_at, num_guests, notes }) {
    this.id = id;
    this._customerId = customer_id; // immutable once set
    this.startAt = start_at instanceof Date ? start_at : new Date(start_at);
    this.numGuests = Number(num_guests);
    this._notes = notes || "";
  }

  /** Getter/Setter demos (Further Study) */

  // Start date must be a Date
  get startAt() {
    return this._startAt;
  }
  set startAt(val) {
    if (!(val instanceof Date) || isNaN(val.valueOf())) {
      throw new Error("startAt must be a valid Date");
    }
    this._startAt = val;
  }

  // numGuests must be >= 1
  get numGuests() {
    return this._numGuests;
  }
  set numGuests(n) {
    n = Number(n);
    if (!Number.isFinite(n) || n < 1) {
      throw new Error("numGuests must be >= 1");
    }
    this._numGuests = n;
  }

  // notes falsey → empty string
  get notes() {
    return this._notes;
  }
  set notes(val) {
    this._notes = val ? String(val) : "";
  }

  // customerId immutable after construction
  get customerId() {
    return this._customerId;
  }
  set customerId(_) {
    if (this._customerId !== undefined) {
      throw new Error("customerId is immutable once set");
    }
  }

  /** Get reservations for a customer */
  static async getForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, customer_id, start_at, num_guests, notes
         FROM reservations
         WHERE customer_id = $1
         ORDER BY start_at`,
      [customerId]
    );
    return results.rows.map((r) => new Reservation(r));
  }

  /** Save: insert or update — Part Six */     // <-- CHANGED
  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations (customer_id, start_at, num_guests, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [this.customerId, this.startAt, this.numGuests, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE reservations
            SET start_at=$1, num_guests=$2, notes=$3
          WHERE id = $4`,
        [this.startAt, this.numGuests, this.notes, this.id]
      );
    }
  }
}

module.exports = Reservation;