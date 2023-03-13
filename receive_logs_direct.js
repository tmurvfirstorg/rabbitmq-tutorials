#!/usr/bin/env node

const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const exchange = "direct_logs";
    const type = "direct";

    channel.assertExchange(exchange, type, {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }
        console.log(" [*] Waiting for logs. To exit press CTRL+C");

        const keys = process.argv.slice(2);
        console.log('receiver', keys);
        keys.forEach(function (severity) {
          channel.bindQueue(q.queue, exchange, severity);
        });

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(
                " [x] %s",
                msg.fields.routingKey,
                msg.content.toString()
              );
            }
          },
          {
            noAck: true,
          }
        );
      }
    );
  });
});
