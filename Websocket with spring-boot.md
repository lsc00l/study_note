

# Websocket
-   하나의 TCP 커넥션으로 full duplex 통신을 제공하는 프로토콜
-   HTTP 와 호환되지만 동일하지는 않다고 함

-   서버에서 발생한 이벤트를 클라이언트에 전달하기 위하여 사용

-   WebSocket 에서는
    -   최초 HTTP 요청(정확히는 WebSocket 을 사용하기 위한 기반 요청)을 통해 WebSocket 커넥션 생성
    -   수립된 WebSocket 연결을 통해 full duplex 로 서버와 클라가 통신
    -   클라이언트마다 커넥션이 살아 있는 것은 동일
        -   역시나 이 방법도 L4 나 Haproxy 같은 reverse proxy 에서는 live connection 이 많아지므로 부하가 많아지지 않을까



| name       | desc                                                 |
| ---------- | ---------------------------------------------------- |
| @OnOpen    | 클라이어트가 접속할 때 발생하는 이벤트               |
| @OnClose   | 클라이언트가 브라우저를 끄거나 다른 경로로 이동할 때 |
| @OnMessage | 메시지가 수신되었을 때                               |




## STOMP
https://stomp.github.io/stomp-specification-1.2.html
- Simple Text Oriented Messaging Protocol
- 메시지의 형식, 유형, 내용 등을 정의하여 메시징 전송을 효율적으로 도와주는 프로토콜

```
COMMAND
header:value

Body
```
- COMMAND를 통해 SEND 또는 SUBSCRIBE, CONNECT 등의 명령을 지정하고, header를 정의할 수 있다. 그리고 메시지는 Body에 담아서 보내는 형식이다.
- SEND는 HTTP의 POST, GET method와 같은 레벨이라 보면 된다. method대신 command라고 부르는데, 
- SEND: 서버로 보내기, 
- SUBSCRIBE: 구독할곳 등록하기, 
- MESSAGE: 다른 subscribers들에게 braodcast하기 
- 쯤으로 이해하면 된다. 사실 이 내부적인 프레임은 라이브러리를 사용하면 별로 직접 볼 일은 없었다.


```

command             = client-command | server-command

client-command      = "SEND"
                      | "SUBSCRIBE"
                      | "UNSUBSCRIBE"
                      | "BEGIN"
                      | "COMMIT"
                      | "ABORT"
                      | "ACK"
                      | "NACK"
                      | "DISCONNECT"
                      | "CONNECT"
                      | "STOMP"

server-command      = "CONNECTED"
                      | "MESSAGE"
                      | "RECEIPT"
                      | "ERROR"
```


spring-starter-websocket + jwt +spring boot
https://bestinu.tistory.com/59

### STOMP - client
- 클라이언트는 SEND(메시지 보내기), SUBSCRIBE(수신 메시지에 관심 표하기) 등의 명령을 사용할 수 있다.
- SEND, SUBSCRIBE 명령을 사용하려면 destination 이라는 헤더를 필요로 하는데 
- destination 헤더는 어디에 메시지를 전송할지(SEND), 그리고 어디에서 메시지를 구독할지(SUBSCRIBE) 알려주는 헤더이다.

```
SUBSCRIBE
id:sub-0
destination:/topic/users
```
- destination 의 값은 어떤 문자열이든 될 수 있다.
- 하지만 일반적으로 
- app/... : WebSocket으로의 앱으로 접속을 위한 포인트가 되며 메시지를 실제로 보낼 때 사용된다
- topic/.../ : publish-subscribe 방식의 one to many 일때 사용하고
- queue/.../ : point to point 방식의 one to one 일때 사용된다.
- user/../ : 메시지를 보내기 위한 사용자를 특정한다

STOMP는 여러 prefix를 통해 흐름을 결정하는데 자주쓰인prefix는 아래와 같다
-   /app은 메세지를 처리할 수 있도록 서버측의 annotated method 로 흐르도록 하기 위한 라우팅이다
-   /topic , /queue 는 broker로 흐르도록하기 위한 라우팅이다

![](/image/message-flow-broker-relay.png)


### STOMP - server

- stomp 서버는 모든 구독자에게 message를 broadcasting 하기 위해 MESSAGE 명령을 사용할 수 있다.
- subscription-id 헤더 :  클라이언트의 id와 일치
- STOMP에서는 서버의 모든 메세지는 특정 클라이언트 구독에 응답하여야 하고 
- 서버 메세지의 subscription-id 의 헤더는 클라이언트 구독의 id헤더와 일치해야한다.


### 구성 요소

`spring-message` 모듈은 스프링 프레임워크의 통합된 메시징 애플리케이션을 위한 근본적인 지원을 한다.

다음 목록에서는 몇 가지 사용 가능한 메시징 추상화에 대해 설명한다.

-   [`Message`](https://docs.spring.io/spring-framework/docs/5.2.8.RELEASE/javadoc-api/org/springframework/messaging/Message.html)는 **`headers`와 `payload`를 포함하는 메시지의 `representation`**이다.
    
-   [`MessageHandler`](https://docs.spring.io/spring-framework/docs/5.2.8.RELEASE/javadoc-api/org/springframework/messaging/MessageHandler.html)는 **`Message` 처리에 대한 계약**이다.
    
-   [`MessageChannel`](https://docs.spring.io/spring-framework/docs/5.2.8.RELEASE/javadoc-api/org/springframework/messaging/MessageChannel.html)는 `Producers`과 `Consumers`의 느슨한 연결을 가능하게 하는 **메시지 전송에 대한 계약**이다.
    
-   [`SubscribableChannel`](https://docs.spring.io/spring-framework/docs/5.2.8.RELEASE/javadoc-api/org/springframework/messaging/SubscribableChannel.html)는 `MessageHandler` 구독자(`Subscribers`)를 위한 `MessageChannel`이다.
    
    즉 `Subscribers`를 관리하고, 해당 채널에 전송된 메시지를 처리할 `Subscribers`를 호출한다.
    
-   [`ExecutorSubscribableChannel`](https://docs.spring.io/spring-framework/docs/5.2.8.RELEASE/javadoc-api/org/springframework/messaging/support/ExecutorSubscribableChannel.html)는 `Executor`를 사용해서 메시지를 전달하는 `SubscribableChannel`이다.
    
    즉, `ExecutorSubscribableChannel`은 각 구독자(`Subscribers`)에게 메시지를 보내는 `SubscribableChannel`이다.



## Pub/Sub 방식과 Message Broker
https://www.bmc.com/blogs/pub-sub-publish-subscribe/


pub/sub는 메시지를 공급하는 객체(publisher)와 소비하는 객체(subscriber)를 분리해 제공하는 비동기식 메시징 방법이다. publisher가 특정 topic에 메시지를 보내면 해당 topic을 구독해놓은 모든 subscriber에게 메시지가 전송되는 방식이다.



## In-Memory 기반 Message Broker 문제점

사실 Spring에서 제공하는 STOMP를 활용하고도, 내장된 Simple Message Broker를 사용해 채팅 서버를 구현할 수 있다. 하지만 Simple Message Broker 같은 경우 스프링 부트 서버의 **내부 메모리에서 동작**하게 된다.

인메모리 기반 브로커를 사용했을 때의 문제점은 다음과 같다.

> -   서버가 down되거나 재시작을 하게되면 Message Broker(메시지 큐)에 있는 데이터들은 유실될 수 있다.  
> -   다수의 서버일 경우 서버간 채팅방을 공유할 수 없게 되면서 다른 서버간에 있는 사용자와의 채팅이 불가능 해진다.

이러한 문제들을 해결하기 위해서는 Message Broker가 여러 서버에서 접근할 수 있도록 개선이 필요하다. 즉, 외부 메시지 브로커를 연동한다면 인프라 비용은 좀 더 증가하겠지만 위 문제들을 해결할 수 있게 된다!










# 구현
https://velog.io/@ohjinseo/WebSocket-Spring-Boot-stomp-Redis-PubSub-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%B1%84%ED%8C%85-%EA%B5%AC%ED%98%84
## WebSocketConfig
