const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const debug = require("debug")("app");

const app = express();

// Importe as classes CRUD para as tabelas aqui
// const {userRouter} = require('./src/routes/users');
// const conteudosRouter = require('./routes/contents');
// const comentariosRouter = require('./routes/comments');
// const materiaisRouter = require('./routes/materials');
// const categoriasRouter = require('./routes/categories');

// Defina as rotas principais do aplicativo
// app.use('/users', userRouter);
// app.use('/contents', conteudosRouter);
// app.use('/comments', comentariosRouter);
// app.use('/materials', materiaisRouter);
// app.use('/categories', categoriasRouter);

const db = new Sequelize('juntos', 'root', '1234', {
  host: '127.0.0.1',
  dialect: 'mariadb',
  port: 3306,
  logging: debug
});

const User = db.define('User', {
  fullName: {
    type: DataTypes.STRING,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "Error: Name must has 3 charactes and maximun 100."
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "Error: Name must has 3 charactes and maximun 100."
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: "Error: enter a valid email."
      }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlphanumeric: {
        args: true,
        msg: "Error: enter a alphanumeric password."
      }
    }
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "Error: enter a valid date."
      }
    }
  },
  type: {
    type: DataTypes.ENUM('admin', 'mentor', 'student'),
    defaultValue: 'student'
  }
}, {
  hooks: {
    beforeCreate: (user) => {
      console.log('Entrou no hook do create');
      console.log(user.firstName);
      console.log(user.lastName);
      user.fullName = `${user.firstName} + ${user.lastName}`;
    },
    beforeBulkCreate: (users) => {
      console.log('Entrou no hook do create');
      users.map(user => {
        console.log(user.firstName);
        console.log(user.lastName);
        user.fullName = `${user.firstName} ${user.lastName}`;
      })
    }
  }
});

const Content = db.define('Content', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('video', 'pdf'),
    allowNull: false
  },
  approved: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  }
});

User.hasMany(Content);
Content.belongsTo(User);

db.sync({
  force:true
});

// Inicialize o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running server at port: ${port}`);
});
