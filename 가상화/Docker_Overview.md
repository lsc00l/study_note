# 도커
도커는 컨테이너 기반의 오픈소스 가상화 플랫폼


https://subicura.com/2017/01/19/docker-guide-for-beginners-1.html



## 컨테이너
- 다양한 프로그램, 실행환경을 컨테이너로 추상화한 것
- 격리된 공간에서 프로세스가 동작하는 기술
- 동일한 인터페이스를 제공하여 프로그램의 배포 및 관리를 단순하게 해준다.
- 백엔드 프로그램, 데이터베이스 서버, 메시지, 큐등 어떤 프로그램도 컨테이너로 추상화할 수 있다.
- 조립PC, AWS, Azure, Google cloud등 어디서든 실행할 수 있다.

## 가상화




## 기존의 가상화 방식과의 차이

![](image/docker_vs_vm.png)
<b>기존 가상화 방식</b>
1. 가상 머신
    - 호스트 OS 위에 게스트 OS 전체를 올려 사용한다.
    - 하드웨어 수준에서 가상화
    - 비교적 사용법이 간단하지만 무겁고 느리다
    - ex) VMware, VirtualBox
2. KVM, 반가상화
    - 게스트 OS가 필요하긴 하지만 전체 OS를 가상화하는 방식이 아니다.
    - OS 수준에서 가상화
    - 컨테이너는 OS 커널을 공유하며 VM에 필요한 것보다 훨씬 적은 메모리를 사용합니다.



이를 개선하기 위해 프로세스를 격리 하는 방식이 등장합니다.

<b>도커</b>
- 단지, 독립된 공간을 만들어 프로세스를 실행하기 때문에 실행속도가 빠르고(띄우는데 1초) 일반적으로 cpu, memory, network 성능저하가 거어어의 없음(호스트 대비 99% 성능 나옴)
- 하나의 서버에 여러개의 컨테이너를 실행하면 서로 영향을 미치지 않고 독립적으로 실행되어 마치 가벼운 VMVirtual Machine을 사용하는 느낌을 줍니다
- 도커를 도와주는 생태계가 엄청남. 편리한 툴과 다양한 문서들이 많고 커뮤니티가 활발함
- 이미지파일을 git처럼 변경분만 저장하기 때문에 컨테이너를 여러개 띄워도 추가적인 용량은 거의 0M임. 실제로 이미지를 원격 저장소에 저장할 때도 push, pull같은 명령어를 이용함

## Docker architecture

![](image/docker_client-host.png)

![](image/docker_architecture.svg)
- Docker uses a client-server architecture
- The Docker client and daemon communicate using a REST API

### The Docker daemon (`dockered`)
- listens for Docker API requests
- manages Docker objects such as images, containers, networks, and volumes.
- communicate with other daemons to manage Docker services.


### The Docker client (`docker`)
- the primary way that many Docker users interact with Docker
- command uses the Docker API
- The Docker client can communicate with more than one daemon.


### Docker Desktop
- Docker Desktop includes the Docker daemon (dockerd), the Docker client (docker), Docker Compose, Docker Content Trust, Kubernetes, and Credential Helper
- Docker Desktop is an easy-to-install application for your Mac, Linux, or Windows environment that enables you to build and share containerized applications and microservices.

### Docker registries
- A Docker registry stores Docker images
- Docker Hub is a public registry that anyone can use
- When you use the `docker pull` or `docker run` commands,
he required images are pulled from your configured registry

## Docker objects
### Images
- 도커에서 이미지란 컨테이너 실행에 필요한 파일과 설정값등을 포함하고 있는 read-only template
- 컨테이너란 이 이미지를 실행한 상태라고 볼 수 있다.
- 여러개의 컨테이너를 생성할 수 있고, 컨테이너의 상태가 변경되거나 삭제되어도 이미지는 변하지 않는다.(Immutable)
- 이미지는 컨테이너를 실행하기 위한 모든 정보를 가지고 있기 때문에 더이상 의존성 파일을 컴파일하고 이것저것 설치할 필요가 없다.
- 새로운 서버가 추가되면 미리 만들어 놓은 이미지를 다운받고 컨테이너를 생성하면 된다.
- 도커 이미지는 Docker hub에 등록하거나 Docker Registry 저장소를 직접 만들어 관리할 수 있습니다.
- 현재 공개된 도커 이미지는 50만개가 넘고 Docker hub의 이미지 다운로드 수는 80억회에 이릅니다. 누구나 쉽게 이미지를 만들고 배포할 수 있습니다.
- https://hub.docker.com/
- https://docs.docker.com/registry/

#### 도커가 빠른 이유
- 도커 이미지는 컨테이너를 실행하기 위한 모든 정보를 가지고 있기 때문에 보통 용량이 수백메가에 이른다. 
- 도커에는 **레이어** 라는 개념을 사용하고 유니온 파일 시스템을 이용하여 여러개의 레이어를 하나의 파일 시스템으로 사용할 수 있게 해준다.
- 즉 A + B + C 에 D가 하나 추가되면 D 레이어만 다운받으면 되기 때문에 굉장히 효율적으로 이미지를 관리할 수 있습니다.
- 컨테이너를 생성할 때도 레이어 방식을 사용하는데 기존의 이미지 레이어 위에 읽기/쓰기 레이어를 추가합니다. 이미지 레이어를 그대로 사용하면서 컨테이너가 실행중에 생성하는 파일이나 변경된 내용은 읽기/쓰기 레이어에 저장되므로 여러개의 컨테이너를 생성해도 최소한의 용량만 사용합니다.


### Containers
- A container is a runnable instance of an image.
- 이미지의 실행 가능한 인스턴스
- You can create, start, stop, move, or delete a container using the Docker API or CLI.
- A container is defined by its image as well as any configuration options you provide to it when you create or start it.



## life cycle

![](/image/docker_lifecycle.png)

-   `docker pull` : Registry로부터 Docker Image를 가져온다.
-   `docker push` : Registry로 Docker Image를 업로드한다(권한 필요).
-   `docker create` : Docker Image로부터 컨테이너를 만든다.
-   `docker start` : 컨테이너를 실행시킨다.
-   `docker run` : 컨테이너를 생성한다. (CREATE + START) 
	*수행할 때마다 create 되므로 필요할때만*
-   `docker stop` : 컨테이너를 정지시킨다.
-   `docker commit` : 컨테이너로부터 Docker Image를 만든다.
-   `docker rm` : 컨테이너를 삭제한다.
-   `docker rmi` : Docker Image를 삭제한다.
-   `docker attach` : 실행중인 컨테이너에 접속한다.



## 참고
https://subin-0320.tistory.com/3

