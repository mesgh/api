const m = require('mongoose');
m.set('debug', true);
async function getConn() {
  await m.connect('mongodb://writer:IcanWrite@91.210.171.78/newusers', { useNewUrlParser: true });
}
getConn().catch(() => console.error('Соединиться	с	БД	не	удалось.	На	этом	всё.'));
module.exports = m;