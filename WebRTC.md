- HTTP
- Web socket
- WebRTC


클라이언트의 통신 방법 3가지
- Direct  (NAT 없이 직접 연결)
- Stun 서버 사용하여 나트가 공인망 주소로 통신 (P2P 통신)
- Turn 서버에 의한 relay 통신(P2P 방식이 아니다.)
WebRTC는 3개의 후보중 최적의 방식을 찾아 통신한다.




## ICE 환경

### - ICE framework(TURN/STUN 연동)
- Interactive Connectivity Establishment (ICE)
- 브라우저가 peer를 통한 연결이 가능하도록 해주는 프레임 워크
-  peer간 단순 연결 시 작동하지 않는 이유들
    -   연결을 시도하는 **방화벽**을 통과해야 함
    -   **단말에 Public IP가 없다**면 유일한 주소값을 할당해야 한다.
    -   **라우터가 peer간의 직접 연결을 허용하지 않을 때** 데이터를 릴레이해야 하는 경우
- ICE는 위의 작업들을 수행하기 위해 **STUN**과 **TURN** 서버 둘 다 혹은 하나의 서버를 사용한다.


- ICE 는 클라이언트의 모든 통신 가능한 주소를 식별하는 것이다. 이를 위해서 다음 3가지를 활용한다.
- 
- Local Address : 클라이언트의 사설 주소(Host Candidate), 랜과 무선랜 등 다수 인터페이스가 있으면 모든 주소가 후보가 됨
- Server Reflexive Address : NAT 장비가 매핑한 클라이언트의 공인망 주소로 STUN에 의해 판단한다.(Server Reflexive Candidate)
- Relayed Address : TURN서버가 패킷 릴레이를 위해 할당하는 주소(Relayed Candidate)

이 3가지 주소로 다음 그림과 같은 연결이 가능하다.

![](/image/ice.png)
- ICE는 우선 연결 가능한 접속 경로들를 수집하고, 해당 경로에 패킷을 송수신해서 각 경로에서 품질이 우수한 것을 사용하는 것이다.







### - STUN(Session Traversal Utilities for NAT)
-  클라이언트 자신의 Public Address(IP:PORT)를 알려준다.
-   peer간의 직접 연결을 막는 등의 라우터의 제한을 결정하는 프로토콜 (현재 다른 peer가 접근 가능하지 여부 결정)
-   클라이언트는 인터넷을 통해 클라이언트의 Public Address와 라우터의 NAT 뒤에 있는 클라이언트가 접근 가능한지에 대한 답변을 STUN서버에 요청한다.
![](/image/webrtc_stun.png)

### - NAT(Network Address Transliation)
- 퍼블릭망과 내부망의 IP와 Port를 매핑해주는 역할
-  단말에 공개 IP(Public IP) 주소를 할당하기 위해 사용한다.
- 라우터는 공개 IP 주소를 갖고 있고 모든 단말들은 라우터에 연결되어 있으며 비공개 IP주소(Private IP Address)를 갖는다.
- 요청은 단말의 비공개 주소로부터 라우터의 공개 주소와 유일한 포트를 기반으로 번역한다. 이 덕분에, 각각의 단말이 유일한 공개 IP 없이 인터넷 상에서 검색 가능하다.
- 몇몇의 라우터들은 Symmetric NAT이라고 불리우는 제한을 위한 NAT을 채용한다. 즉, peer들이 오직 이전에 연결한 적 있는 연결들만 허용한다. 따라서 STUN서버에 의해 공개 IP주소를 발견한다고 해도 모두가 연결을 할수 있다는 것은 아니다.(위의 설명에서 STUN 서버에 다른 peer가 접근 가능한지 여부를 요청하는 이유)
- 이를 위해 TURN이 필요하다.


### - TURN(Traversal Using Relays around NAT)
- 서버 간 트래픽을 중계하는 데 필요
-  TURN 서버와 연결하고 모든 정보를 그 서버에 전달하는 것으로 Symmetric NAT 제한을 우회하는 것을 의미한다.
-   이를 위해 TURN 서버와 연결 한 후 모든 peer들에게 저 서버에 모든 패킷을 보내고 다시 나(TURN서버)에게 전달해달라고 해야 한다.
-   명백히 버헤드가 발생므로 이 방법은 다른 안이 없을 경우만 사용해야 한다.
![](/image/webrtc_turn.png)


## 용어

### - SDP (Session Description Protocol)
- 데이터가 전송되면 두 피어가 서로를 이해할 수 있도록 해상도, 형식, 코덱, 암호화 등과 같은 연결의 멀티미디어 콘텐츠를 설명하는 프로토콜
- 기술적으로 SDP는 진정한 프로토콜이 아니라 장치 간에 미디어를 공유하는 연결을 설명하는 데 사용되는 데이터 형식



### DTLS-SRTP
- Datagram Transport Layer Security 
- Secure Real-time Transport Protocol
- 


### - 미디어 연결 방식 Media Stream Type
![](/image/webrtc-server.png)

#### - Mesh = P2P
- 서버 방식이 아닌 클라이언트간의 다중 연결 방식
- 처음 WebRTC가 peer간의 정보를 중계할 때만 서버 부하 발생
- peer간 연결이 완료되면 서버에 별도의 부하가 없다. 
- 1:1 연결에 적합하다
**장점**
- 서버 자원이 적게 든다
- 실시간 성이 보장된다.
**단점**
- N:N 혹은 N:M 연결에서 클라이언트의 과부하가 급증

#### - SFU(Selective Forwarding Unit)
- 중앙 서버가 종단 간의 미디어 트래픽을 중계하는 방식
- 서버와 클라이언트 간의 peer를 연결
- 데이터 송신은 서버에게만 보내면 된다 => **Uplink가 1개**
- 하지만 상대방의 수만큼 데이터를 받는 peer를 유지 => Downlink는 P2P(signaling 서버)와 동일
- 1:N 형식 또는 소규모 N:M 형식의 실시간 스트리밍에 적합
- zoom, meet에서 다음 방식 사용함
- UI에 대해 더 많은 유연성을 가질 수 있다는 것입니다. 클라이언트에서는 참가자의 순서를 재구성할 수 있지만 MCU에서는 불가능합니다. 이를 통해 사용자 지정 레이아웃을 보유하고 실시간으로 변경할 수 있습니다.
**장점**
- P2P보단 느리지만 비슷한 수준의 실시간성 유지
- P2P보다 클라이언트가 받는 부하가 줄어든다.
**단점**
- 서버 비용이 증가
- 대규모 N:M 구조에서는 여전히 클라이언트가 많은 부하 감당


#### - MCU(Multi-point Control Unit)
- 다수의 송출 미디어를 중앙 서버에서 혼합(mixing) or 가공(transcoding)하여 수신측으로 전달하는 방식
- 서버와 클라이언트 간의 peer를 연결
- 서버 자원을 활용하여 각 클라이언트의 부담을 줄이는 연결 방식
- 중앙 서버의 높은 컴퓨팅 파워가 요구된다.
**장점**
- 클라이언트의 부하가 현저히 줄어든다. (항상 Uplink 1개, Downlink 1개로 총 2개)
**단점**
- WebRTC의 최대 장점인 실시간성이 저해된다. 
- video, audio를 결합하는 과정에서 비용이 많이 든다. 




## 구성
### Signaling Server Module
- (Call Application과 Whiteboard Application)
- 실시간으로 영상, 음성 데이터를 통신하는 기술
- 서로 다른 네트워크에 있는 클라이언트가 상대방의 IP, 미디어 유형, 코덱 등 초기화하는 과정을 시그널링이라 부르며, 이를 지원하는 서버가 시그널링 서버
- Web Browser에서 Client Side Application을 구동
- Client Side Application과 signal 처리 연동을 통해 Media Server를 제어하여 WebRTC 통화/컨퍼런스 서비스를 제공
- 별도의 web서버 연동으로 판서 서비스 기능 제공
### Media Server Module
- WebRTC 영상/음성 스트림 처리를 담당
- Signaling Server의 제어를 받아 동작
- 기본적으로 SFU 방식으로 동작하며 Web Browser 내부의 WebRTC 모듈과 연동된다


### TURN/STUN Server Module
- 방화벽 네트워크 환경에서 Media 처리를 위한

그 외...
##### Media Repository
- 녹취/녹화 파일 저장을 위한 모듈
- WebRTC 영상/음성 스트림을 저장하거나 저장된 영상을 스트림에 실어 보내고자 할 때 사용된다.
##### DBMS
- 가입자 정보(Register 정보, Conference Room 정보 등) 저장을 위한 모듈
- 룸, 참여자 등의 다양한 정보를 저장하고 통계 데이터를 저장한다.
#### Record Module
- 녹취 스트리밍 처리를 위한 부가 모듈
