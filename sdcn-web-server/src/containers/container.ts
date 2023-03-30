import { asClass, asValue, createContainer } from 'awilix';
import NodeControler from '../controllers/NodeController';
import UserController from '../controllers/UserController';
import { RedisService, UserRepository } from '../repositories';
import NodeService from '../services/NodeService';
import UserService from '../services/UserService';
import database from '../utils/database';

const container = createContainer();

container.register({
  knex: asValue(database.knex),
  redis: asValue(database.redis),
  userRepository: asClass(UserRepository)
    .inject(() => ({ knex: database.knex }))
    .singleton(),
  redisService: asClass(RedisService)
    .inject(() => ({ knex: database.redis }))
    .singleton(),
  userService: asClass(UserService)
    .inject(() => ({
      userRepository: container.resolve<UserRepository>('userRepository'),
      redisService: container.resolve<RedisService>('redisService'),
    }))
    .singleton(),
  userController: asClass(UserController)
    .inject(() => ({ userService: container.resolve<UserService>('userService') }))
    .singleton(),
  nodeService: asClass(NodeService)
    .inject(() => ({ redisService: container.resolve<RedisService>('redisService') }))
    .singleton(),
  nodeController: asClass(NodeControler)
    .inject(() => ({ nodeService: container.resolve<NodeService>('nodeService') }))
    .singleton(),
});

export default container;