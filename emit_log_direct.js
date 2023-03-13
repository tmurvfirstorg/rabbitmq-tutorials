#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

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

    console.log('proc', process.argv)
    const msg = process.argv.slice(3).join(" ") || "Hello World!";
    const severity = process.argv.length > 0 ? process.argv[2] : "info";

    console.log(severity, msg, type)
    channel.assertExchange(exchange, type, {
      durable: false,
    });

    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s, '%s'", severity, msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});
