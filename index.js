const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const CRUD = require('./js/operations/CRUD');
const Writer = require('./js/models/Writer');
const app = express();
const Router = express.Router();

const checkAuth = (r, res, next) => {
  if (r.session.auth === 'ok') {
    next();
  } else {
    res.redirect('/login');
  }
};

Router
  .route('/')
  .get(CRUD.read)
  .post(CRUD.create)
  .put(CRUD.update);
Router
  .route('/:login')
  .delete(CRUD.del);

app
  .set('view engine', 'pug')

  .use(bodyParser.json())

  .use(bodyParser.urlencoded({ extended: true }))

  .use(session({ secret: 'mysecret', resave: true, saveUninitialized: true }))
  
  .get('/', r => r.res.redirect('/login'))
  
  .get('/login', r => r.res.render('login'))
  
  .post('/login/check/', async r => {
    const { body: { login } } = r;
    const user = await Writer.findOne({ login });
    if (user) {
      if (user.password === r.body.pass) {
        r.session.auth = 'ok';
        r.session.login = login;
        if (login === 'prof@univer.msk.ru') {
          r.session.admin = true;
        } else {
          r.session.admin = false;
        }
        r.res.redirect('/profile');
      } else {
        r.res.send('Неверный	пароль!');
      }
    } else {
      r.res.send('Нет	такого	пользователя!');
    }
  })
  
  .get('/profile', checkAuth, r => r.res.render('profile', { login: r.session.login }))
  
  .use('/users', checkAuth, Router)

  .post('/logout', r => {
    delete r.session.auth;
    delete r.session.login;
    r.res.redirect('/login');
  })

  .use(r => {
    r.res
      .status(404)
      .set({
        'Content-Type': 'text/html; charset=utf-8'
      })
      .send('<h1>Не найдено!</h1>');
  })

  .listen(process.env.PORT || 80);