const Writer = require('../models/Writer');

const CRUD = {
  async create(r) {
    const { body } = r;
    if (body.login) {
      const user = await Writer.findOne({ login: body.login });
      if (user) {
        r.res.status(400).send('Такой пользователь уже существует!');
      } else {
        const newUser = new Writer(body);
        try {
          await newUser.save();
        } catch (err) {
          console.error(err);
          r.res.status(400).send(`ERROR: ${err}!`);
        }
        r.res.status(200).send(`Пользователь ${body.login} создан!`);
      }
    } else {
      r.res.status(400).send('Нет логина!');
    }
  },
  async read(r) {
    const users = await Writer.find();
    r.res.render('users', { login: r.session.login, admin: r.session.admin, users })
  },
  async update(r) {
    const { body } = r;
    await Writer.updateOne({ login: body.login }, { $set: { password: body.password } });
    r.res.status(200).send("Пароль изменён!")
  },
  async del(r) {
    const login = r.params.login;
    if (login !== r.session.login) {
      await Writer.deleteOne({ login });
      r.res.status(200).send("Пользователь удалён!");
    } else {
      r.res.status(400).send("Нельзя удалить свой аккаунт!");
    }
  },
};
module.exports = CRUD;
