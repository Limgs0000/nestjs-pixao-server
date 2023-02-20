import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8086, {
  // secure: true,
  // reconnection: false,
  // rejectUnauthorized: false,
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowEIO3: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  users = 0;
  constructor(private readonly eventsService: EventsService) {}

  //OnGatewayConnection를 오버라이딩
  async handleConnection() {
    this.users++; //사용자 증가
    this.server.emit('users', this.users);
    console.log(this.users);
  }

  //OnGatewayDisconnect를 오버라이딩
  async handleDisconnect() {
    this.users--; //사용자 감소
    this.server.emit('users', this.users);
    console.log(this.users);
  }

  // @SubscribeMessage('ClientToServer')
  // async handleMessage(@MessageBody() data) {
  //   this.server.emit('ServerToClient', data);
  // }

  @SubscribeMessage('chat')
  async onChat(client: Socket, message) {
    console.log('123', client.rooms); //현재 클라이언트의 방
    console.log(message); //메시지
    // client.broadcast.emit('chat', message); //전체에게 방송함
    this.server.emit('chat', message);
  }

  @SubscribeMessage('chatSend')
  async onChatSend(client: Socket, message) {
    console.log('client => ', client);
    console.log('message => ', message);
    client.join(message.data);
    // client.this.server.to(message.data).emit('chatReceive', 'asdfasdfsafdsa');
  }

  @SubscribeMessage('ClientToServer')
  async handleMessage(@MessageBody() data) {
    console.log(123);
    this.server.emit('ServerToClient', '통신함!!');
  }
  @SubscribeMessage('createEvent')
  create(@MessageBody() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @SubscribeMessage('findAllEvents')
  findAll() {
    return this.eventsService.findAll();
  }

  @SubscribeMessage('findOneEvent')
  findOne(@MessageBody() id: number) {
    return this.eventsService.findOne(id);
  }

  @SubscribeMessage('updateEvent')
  update(@MessageBody() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(updateEventDto.id, updateEventDto);
  }

  @SubscribeMessage('removeEvent')
  remove(@MessageBody() id: number) {
    return this.eventsService.remove(id);
  }
}
