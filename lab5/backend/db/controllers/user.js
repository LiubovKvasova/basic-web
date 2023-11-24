const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');

const { User } = require('../models');
const { Session } = require('../models');
const { UserInfo } = require('../models');

const saltRounds = 10;

const hashPassword = (password) => {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  } catch (err) {
    return;
  }
};

module.exports = {
  list(req, res) {
    return UserInfo.findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  add(req, res) {
    // user_id, pib, group, id_card, birthday, email, admin?
    const passwordHash = hashPassword(req.body.password);
    if (passwordHash) {
      User.create({
        email: req.body.email,
        passhash: passwordHash,
      })
        .then((user) => {
          if (!user) {
            return res.status(401).send({ message: 'Error while signing up' });
          }
          UserInfo.create({
            user_id: user.id,
            pib: req.body.pib,
            group: req.body.group,
            id_card: req.body.id_card,
            birthday: req.body.birthday,
            email: req.body.email,
            admin: false,
          }).then((userInfo) => {
              if (!userInfo) {
                return res
                  .status(401)
                  .send({ message: 'Error while signing up (userInfo)' });
              }

              return res.status(201).send({
                message: 'Signup successful',
                user: user.id,
                pib: userInfo.pib,
              });
            })
            .catch((error) => {
              User.destroy({ where: { id: user.id } }).then(() =>{
                return res.status(400).send({ error });
              })
              return res.status(400).send({ error });
            });
        })
        .catch((error) => {
          if(!error?.errors[0]){
            return res.status(400).send(error)
          }
          const errArr = [];
          error.errors.map((er) => {
            errArr.push(er.message);
          });
          return res.status(400).send({ error: errArr.join(' ') });
        });
    } else {
      res.status(400).send(new Error('Could not hash password'));
    }
  },

  delete(req, res) {
    const { session_id, user_data } = req.body;
    const userToDelete = user_data?.user_id;

    Session.findOne({
      where: {
        [Op.and]: [{ session_id }, { expirationDate: { [Op.gt]: new Date() } }],
      },
      include: {
        model: User,
        as: 'sessions_userid_fk',
        include: {
          model: UserInfo,
          as: 'userinfo_userid_fk',
        },
      },
    }).then((data) => {
      if (!data) {
        return res
          .status(401)
          .send({ message: 'No user found with this session' });
      }
      if (
        data?.sessions_userid_fk?.userinfo_userid_fk?.user_id !==
          userToDelete &&
        !data?.sessions_userid_fk?.userinfo_userid_fk?.admin
      ) {
        return res
          .status(401)
          .send({ message: 'User does not have permission for that action' });
      }
      Session.destroy({ where: { user_id: userToDelete } })
        .then(() => {
          UserInfo.destroy({ where: { user_id: userToDelete } })
            .then(() => {
              User.destroy({ where: { id: userToDelete } })
                .then(() =>
                  res.status(200).send({
                    message:
                      'User and associated data were successfully deleted!',
                  })
                )
                .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    });
  },

  login(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Invalid email or password' });
        }

        bcrypt.compare(password, user.passhash, (err, result) => {
          if (result === true) {
            // Passwords match, user is authenticated
            const sessionId = crypto.randomBytes(32).toString('hex');
            return Session.create({
              session_id: sessionId,
              user_id: user.id,
              expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
              .then((session) => {
                res.status(200).send({
                  message: 'Login successful',
                  session: session.session_id,
                  expires: session.expirationDate,
                });
              })
              .catch((error) => res.status(400).send(error));
          } else {
            // Passwords don't match, authentication failed
            return res
              .status(401)
              .send({ message: 'Invalid email or password' });
          }
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  getUserData(req, res) {
    const { session_id } = req.body;

    Session.findOne({
      where: {
        [Op.and]: [{ session_id }, { expirationDate: { [Op.gt]: new Date() } }],
      },
      include: {
        model: User,
        as: 'sessions_userid_fk',
        include: {
          model: UserInfo,
          as: 'userinfo_userid_fk',
        },
      },
    }).then((data) => {
      if (!data) {
        return res
          .status(401)
          .send({ message: 'No user found with this session' });
      }

      res.status(200).send({
        user_id: data.user_id,
        user_data: data?.sessions_userid_fk?.userinfo_userid_fk,
      });
    });
  },

  update(req, res) {
    const { session_id, user_data } = req.body;
    const userToChange = user_data?.user_id;

    Session.findOne({
      where: {
        [Op.and]: [{ session_id }, { expirationDate: { [Op.gt]: new Date() } }],
      },
      // include: UserInfo,
      include: {
        model: User,
        as: 'sessions_userid_fk',
        include: {
          model: UserInfo,
          as: 'userinfo_userid_fk',
        },
      },
    }).then((data) => {
      if (!data) {
        return res
          .status(401)
          .send({ message: 'No user found with this session' });
      }
      if (
        data?.sessions_userid_fk?.userinfo_userid_fk.user_id !== userToChange &&
        !data?.sessions_userid_fk?.userinfo_userid_fk.admin
      ) {
        return res
          .status(401)
          .send({ message: 'User does not have permission for that action' });
      }
      UserInfo.findOne({ where: { user_id: userToChange } }).then(
        (userInfo) => {
          if (!userInfo) {
            return res
              .status(401)
              .send({ message: 'Could not find user with that user_id' });
          }
          userInfo
            .update({
              pib: user_data.pib || userInfo.pib,
              group: user_data.group || userInfo.group,
              id_card: user_data.id_card || userInfo.id_card,
              birthday: user_data.birthday || userInfo.birthday,
              email: user_data.email || userInfo.email,
            })
            .then(() => res.status(200).send(userInfo))
            .catch((error) => res.status(400).send(error));
        }
      );
    });
  },
};
