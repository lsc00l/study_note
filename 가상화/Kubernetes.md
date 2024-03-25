# k8s Object
> Kubernetes Objects are persistent entities in the Kubernetes system. Kubernetes uses these entities to represent the state of your cluster.

- k8s 클러스터의 현재 상태 혹은 클러스터에 배포된 서비스의 현재 상태를 보관하고 표현하는 추상적인 개체를 가리킵니다.



object의 구체적인 예로 Pod, Service, Volume, Namespace 등이 있습니다. 여기서 object는 상태를 나타냅니다.
pod를 예를 들면 해당 app의 docker image, tag, container의 초기 실행 명령, container에 전달할 환경 변수, container에 마운트할 스토리지 볼륨, container 현재 실행 상황 등 이 모든 것을 상태라고 보면 됩니다.



- k8s에서 클러스터 상태를 얘기할 때, 크게 두가지로 이야기합니다. 하나는 사용자가 원하는 상태(the desired state), 
나머지 하나는 현재 상태(current state)입니다.

 결국 k8s의 주 역할은 한마디로 다음과 같습니다.

> “현재 클러스터 상태(current state)가 사용자가 원하는 클러스터 상태(the desired state)에 도달할 수 있도록 끊임없이 k8s object들을 모니터링하고 조작하고 조정(control)한다.”



# k8s Controllers
> Kubernetes contains a number of higher-level abstractions called Controllers. Controllers build upon the basic objects, and provide additional functionality and convenience features.

- Controller는 위에서 설명드렸던 object들을 기초해서 추가적인 기능과 편의성을 제공하는 개념입니다.
- controller도 좀 특별한 k8s object로 인식할 수 있고, 일반 object보다 기능적인 면이 더해진 특별한 목적성을 갖는 object라고 볼 수 있습니다
- 또는 클러스터의 현재 상태(current state)를 사용자가 희망하는 상태(the desired state)로 조절해 주는 온도 조절기 같은 것이라고 보기도 합니다
- k8s controller의 구체적인 예로 ReplicaSet, Deployment, StatefulSet, DaemonSet, Job 등이 있습
- 



# k8s Control Plane
 - k8s 에서의 control plane은 쉽게 풀어 얘기하자면 현재의 클러스터 상태를 사용자가 원하는 클러스터 상태로 끊임없이 조정해 주는 컨트롤 센터라고 보면 됩니다.
 - control plane에는 실제 서비스와는 무관한 기본적인 k8s 클러스터의 운영과 관련 있는 컴포넌트들이 존재합니다.
 - 

과정 ..?
- 사용자가 원하는 클러스터 상태란 영어로 the desired state라고 표현합니다. 주로 사용자가 [yaml](https://yaml.org/) 파일로 자신이 최종적으로 원하는 서비스(클러스터) 상태를 명세(manifest)해서 k8s object와 controller를 정의합니다.
- 이를 클러스터에 적용하면 k8s control plane에 있는 컴포넌트들이 사용자가 바라는 상태(사용자의 명세)대로 끊임없이 그리고 스마트하게 클러스터 상태를 맞춰 조정



하나의 k8s 클러스터의 control plane에는 크게 다음과 같은 두가지 컴포넌트가 존재합니다.

1.  Master: 클러스터의 컨트롤 타워 역할을 하고, master node라고도 불립니다. 보통 작은 규모의 클러스터라면 vm 한대를 사용하고, HA(고가용성, high-availability) 클러스터에서는 vm 3대로 구성됩니다. Master 안에는 kube-apiserver, etcd, kube-scheduler, kube-controller-manager 등의 하위 컴포넌트들이 존재합니다.
2.  Nodes: 클러스터의 일꾼 역할을 하는 vm들인데, woker node라고도 불립니다. 서비스 규모에 따라 다르지만 보통 3대 이상의 vm으로 구성되며 CPU/메모리 리소스 사용 요구량에 따라 수평적으로 늘이거나 줄일 수 있습니다. worker node에는 실제 서비스 application들이 docker container 형태로 배포됩니다. 배포된 container들은 클러스터 master와 통신하는 kubelet이라는 에이전트 컴포넌트 통해 운영되며, 이 kubelet은 각 vm 별로 하나씩 존재합니다. 하나의 worker node에는 kubelet, kube-proxy, docker system이 하위 컴포넌트로 있습니다.



``` yaml
metadata:
 name: myapp-pod
 labels:
   app: myapp
```

name은 동일한 namespace 상에서는 유일한 값을 이름으로 가져야 합니다. 
label은 특정 k8s object만을 나열한다거나 검색할 때 유용하게 쓰일 수 있는 key-value 쌍입니다.








https://medium.com/coinone/%EC%A2%8C%EC%B6%A9%EC%9A%B0%EB%8F%8C-kubernetes-%EC%9D%B5%ED%9E%88%EA%B8%B0-1-a3ed78720adc
https://medium.com/coinone/%EC%A2%8C%EC%B6%A9%EC%9A%B0%EB%8F%8C-kubernetes-%EC%9D%B5%ED%9E%88%EA%B8%B0-2-36e17a75d36c
https://medium.com/coinone/%EC%A2%8C%EC%B6%A9%EC%9A%B0%EB%8F%8C-kubernetes-%EC%9D%B5%ED%9E%88%EA%B8%B0-3-5d6cd6b6b1d0