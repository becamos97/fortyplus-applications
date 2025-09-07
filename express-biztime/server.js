/** Server startup for BizTime. */


const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`BizTime server starting on port ${PORT}`);
});