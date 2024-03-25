# Install Docker

https://docs.docker.com/engine/install/ubuntu/
## Prerequisites


### Uninstall old versions
```  bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```
Uninstall the Docker Engine, CLI, containerd, and Docker Compose packages
``` bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-compose-plugin
```
이미지, 컨테이너, 볼륨은 `/var/lib/docker/` 이 위치에 저장되는데 도커를 지워도 지워지지 않는다.
지우고 싶다면 아래의 명령어를 사용한다.

``` bash
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

### 도커 설치하기

#### 설치하기
도커를 설치하는 방법 중 자동 설치 스크립트를 이용하는 것이 가장 쉽다.

```bash
curl -fsSL https://get.docker.com/ | sudo sh
```

#### 권한 추가하기
```bash
sudo usermod -aG docker $USER # 현재 접속중인 사용자에게 권한주기
sudo usermod -aG docker your-user # your-user 사용자에게 권한주기
```

#### 설치 확인하기 
```bash
docker -version
```

https://wnsgml972.github.io/setting/2020/07/20/docker/

### 컨테이너 실행하기
``` shell
docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

