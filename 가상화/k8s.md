핵심 기능 세네 가지 정도 

ex ) 
노드와 서버 
노드에 팟 넣기
노드에 팟 배치 룰
yaml 
네트워크 구성
팟 ip 구성 방법
ingress : 호 들어왔을 떄 분배 방법


repo 
swap

패킷 포워딩이 가능하도록 설정하고, 
방화벽 및 selinux를 해제하며, 
메모리 swapping을 비활성화하는 것



kube2 폴더에서 하기

[199]
파이썬 명령어 내릴 떄는 버전 명시하기
python3.9
pip3.9 


history




master 노드에는 두개 정도 
워커에는 세개 정도 서비스가 떠야한다


#### bastion host
k8s 기본 용어임
- 보안을 위해 고안된 Host
- 외부 네트워크와 내부 네트워크 사이에서 일종의 게이트웨이 역할을 수행하는 호스트를 뜻한다. 
- 특히 Private IP로만 접근이 허용된 서버를 외부에서 접속하고자 할 경우, Bastion Host를 경유하여 Private IP 서버에 접근하도록 설계되곤 한다.
https://jadehan.tistory.com/66


## 노드
- 쿠버네티스 내에 떠있는 호스트들(가상머신이나 물리적 서버머신)
- 이중에서도 마스터 노드와 일반 노드들로 나뉘는데, 
- 마스터 노드에는 쿠버네티스 클러스 전체를 관리하기 위한 관리 컴포넌트들이 자리하는 곳이고, 
- 이 관리 컴포넌트들에 의해 일반 노드들로 컨테이너들이 오케스트레이션 되는 구조이다

마스터 노드에 들어가는 관리 컴포넌트들의 종류는 아래와 같다

- kube-apiserver
- kube-scheduler
- kube-controller-manager
- etcd

- 마스터 노드에는 이 관리 컴포넌트 외에 다른 컴포넌트(Pod)들은 들어갈 수 없다






https://joont92.github.io/kubernetes/%EC%A3%BC%EC%9A%94-%EA%B0%9C%EB%85%90/
https://bcho.tistory.com/1256?category=731548
https://nearhome.tistory.com/87?category=954519
# Object
- java의 object 와 비슷한 개념
- 쿠버네티스에서 가장 중요한 부분은 `오브젝트`라는 개념인데, 이 오브젝트는 크게 `기본 오브젝트`와 `컨트롤러`로 나뉜다  
- 기본 오브젝트는 리소스들의 가장 기본적인 구성 단위이며, 
- 컨트롤러는 이 기본 오브젝트들을 생성하고 관리하는 기능을 가진 애들을 말한다

- `스펙` : 개발자가 직접 작성해서 전달해줘야 하는 것, 오브젝트가 어떤 상태가 되어야 한다고 작성한 것 

## 기본 오브젝트

### 1. Pod
- 컨테이너화된 어플리케이션
- 
- 쿠버네티스의 가장 작은 배포 단위
- 각 pod 마다 고유한 ip를 할당 받는다
- 여러 개의 컨테이너가 하나의 pod에 속할 수 있다.
- 왜 개별적으로 하나씩 컨테이너를 배포하지 않고 여러개의 컨테이너를 Pod 단위로 묶어서 배포하는 것인가?
	- Pod는 다음과 같이 매우 재미있는 특징을 갖는다.
	-  Pod 내의 컨테이너는 IP와 Port를 공유한다.
	- Pod 내에 배포된 컨테이너간에는 디스크 볼륨을 공유할 수 있다.

``` yaml
apiVersion: v1  
kind: Pod  
metadata:  
name: myapp-pod  
labels:  
app: myapp  
spec:  
containers:  
- name: myapp-container  
image: busybox # 이미지는 로컬을 참조하지 않고 항상 registry에서 땡겨오는 것 같다  
command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```
### 2. Service
- 로드밸런서
-  Pod은 삭제되거나 추가되는 행위가 잦은 리소스이다(scalable) 
  문제는 매번 삭제되고 추가될 때 마다 IP가 랜덤하게 새로 부여된다.
  Pod의 경우 보통 1개로 운영하지 않고, 여러개의 Pod을 띄워서 로드밸런싱을 제공해줘야 한다.
- 즉, 이러한 역할을 해주는 리소스가 Pod들 앞단에 하나 더 존재해야하는데, 서비스가 이러한 역할을 한다.
- 서비스는 지정된 IP로 생성이 가능하고, 여러 Pod를 묶어서 로드 밸런싱이 가능하며, 고유한 DNS 이름을 가질 수 있다.
- 서비스가 Pod 들을 묶을 때는 `레이블`과 `셀렉터` 라는 개념을 사용하는데, 아래의 스펙을 보면 직관적으로 이해할 수 있을 것이다
``` yml
apiVersion: v1  
kind: Service  
metadata:  
  name: my-service  
spec:  
  selector:  
    app: myapp  
  ports:  
    - protocol: TCP  
      port: 80
```
- `app: myapp` 이라는 레이블을 가진 Pod 들을 선택해서 `my-service` 라는 서비스로 묶겠다는 의미이다


### 3. Volume
- 디스크
- 볼륨은 컨테이너의 외장 디스크로 생각하면 된다. 
- Pod가 기동할때 컨테이너에 마운트해서 사용한다.
### 4. Namespace
- 패키지명
- 한 쿠버네티스 클러스터내의 논리적인 분리단위
- 


위 4개의 기본 오브젝트로 어플리케이션을 설정하고 배포하는것이 가능


# 컨트롤러
## Replica Set

## Deployment

## Statepool? Set

## Deamon Set

## Job















## Deployment
-  ReplicaSet을 감싸고 있는, 배포 버전을 관리하는 오브젝트
- 내부적으로 ReplicaSet을 활용해 무중단버전관리를 가능하게 한다


## Service-Cluster IP
- 쿠버네티스는 네트워크도 Service라는 별도의 오브젝트로 관리
-  서비스 중에서도 클러스터ip는 클러스터 내부에서 사용하는 프록시 서비스
- 클러스터ip에 요청을 보내면 여러 개의 pod 중 하나로 자동으로 요청이 가는 것
- 클러스터 ip를 사용하는 이유는 pod의 ip 는 동적이기 때문
- 디플로이먼트 앞에 존재해 파드의 ip 와는 상관없이 액세스할 수 잇도록하는 고유의 ip를 가진 서비스가 service-cluster ip  
- 클러스터 내부에서 서비스 연결은 dns를 이용


## Service-NodePort
- 클러스터ip는 클러스터 내부에서만 통신 할 수 있다
- 그래서 외부 브라우저에서도 접근할 수 있도록, NodePort라는 개념이 생깁니다.
- NodePort는 노드(host)에 노출되어 외부에서도 접근이 가능한 서비스
- 
## Service-LoadBalancer
- 모든 노드에 외부 접속 분산 요청을 처리하기 위해서는 NodePort보다는 Load Balancer 사용이 적절
- 단 1개의 IP만을 외부에 노출하여 해당 IP로 모든 트래픽을 부하 분산

## Ingress
- 도메인 이름, 도메인 패스를 따라 내부에 있는 클러스터 IP에도 같은 이름으로 연결할 수 있도록 해준다.


## Control plane
 클러스터에 관한 전반적인 결정(예를 들어, 스케줄링)을 수행하고 클러스터 이벤트를 감지하고 반응한다.

## kube-apiserver


























