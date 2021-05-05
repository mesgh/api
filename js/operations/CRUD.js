const Writer = require('../models/Writer');

const CRUD = {
  async create(r) {
    const { body } = r;
    const user = await Writer.findOne({ login: body.login });
    if (user) {
      r.res.send('Такой пользователь уже существует!');
    } else {
      const newUser = new Writer(body);
      try {
        await newUser.save();
      } catch (err) {
        console.error(err);
      }
      r.res.redirect('/users');
    }
  },
  async read(r) {
    const users = await Writer.find();
    r.res.render('users', { login: r.session.login, admin: r.session.admin, users })
  },
  async update(r) {
    const { body } = r;
    await Writer.updateOne({ login: body.login }, { $set: { password: body.password } });
    r.res.redirect('/users');
  },
  async del(r) {
    console.log(id);
    const body = JSON.parse(decodeURI((r.url).slice(1)));
    await Writer.deleteOne({ login: body.login });
    r.res.redirect(301, '/users');
  },
};
module.exports = CRUD;
// prof@univer.msk.ru
