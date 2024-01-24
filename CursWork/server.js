const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://root:example@mongo:27017/';
const dbName = 'usercart';

app.use(express.static('public'));

app.get('/', function(req, res) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Ошибка подключения к базе данных:', err);
      res.send('Ошибка подключения к базе данных');
    } else {
      console.log('Успешное подключение к базе данных');

      const db = client.db(dbName);
      const collection = db.collection('products');

      collection.find({}).toArray(function(err, products) {
        if (err) {
          console.log('Ошибка получения данных из базы данных:', err);
          res.send('Ошибка получения данных из базы данных');
        } else {
          console.log('Полученные данные из базы данных:', products);

          let html = '';
          products.forEach((product, index) => {
            const divId = `product${index + 1}`;
            html += `
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${product.Name}</h5>
                  <p class="card-text">ID: ${product.ID}</p>
                  <p class="card-text">Price: ${product.Price}</p>
                  <p class="card-text">Quantity: ${product.Quantity}</p>
                </div>
              </div>
            `;
          });

          client.close();

          res.send(`
            <html>
              <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.0-beta1/css/bootstrap.min.css">
              </head>
              <body>
                <div class="container">
                  ${html}
                </div>
              </body>
            </html>
          `);
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});