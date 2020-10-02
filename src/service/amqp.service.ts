import * as amqp from 'amqplib';

export interface AMQPConfig {
  protocol: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export class AMQPService {
  private static amqpService: AMQPService;
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  static getInstance() {
    if (!AMQPService.amqpService) {
      AMQPService.amqpService = new AMQPService();
    }
    return AMQPService.amqpService;
  }
  /**
   * Check whether is connected to AMQP.
   */
  hasConnection() {
    return this.connection && this.channel;
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
    this.channel = undefined!;
    this.connection = undefined!;
  }

  /**
   * Init must be called before getConnection.
   *
   * @param {any} config - AMQP configuration.
   */
  async init(config: AMQPConfig) {
    if (this.hasConnection()) {
      await this.connection.close();
    }

    this.connection = await amqp.connect({
      protocol: config.protocol,
      hostname: config.host,
      port: config.port,
      username: config.user,
      password: config.password
    });

    this.channel = await this.connection.createChannel();
  }

  /**
   * Public to queue.
   *
   * @param {string} queueName - Queue name.
   * @param {any} message - Message.
   */
  async publish(queueName: string, message: any) {
    await this.channel.assertQueue(queueName);
    await this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }
}
