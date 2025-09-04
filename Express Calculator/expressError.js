/** ExpressError: extend normal error to include status. */
class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}
module.exports = ExpressError;