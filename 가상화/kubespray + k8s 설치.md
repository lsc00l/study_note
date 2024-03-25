

https://memory-hub.tistory.com/8
https://blog.naver.com/PostView.nhn?blogId=alice_k106&logNo=221315933945

#### host 설정
- 필수적인 것은 아니지만, 추후에 각 노드에 편리하게 접근할 수 있도록 호스트 이름을 /etc/hosts에 추가한다.

```
[root@k8s-master ~] cat /etc/hosts
10.0.10.10 k8s-master
10.0.10.11 k8s-node1
10.0.10.12 k8s-node2
10.0.10.13 k8s-node3
```

#### ssh-keygen 설정(마스터)
- ssh-keygen -t rsa 커맨드를 입력해 ssh 키를 생성 
- 각 노드간 패스워드 없이 접근 가능하도록
```
[root@k8s-master ~] ssh-keygen -t rsa
[root@k8s-master ~] ssh-copy-id root@10.0.2.10
root@10.0.2.10's password:

## k8s-master를 포함한 모든 노드에서 아래의 명령어를 동일하게 수행 ##

```

#### 기타 설정
- **k8s-master를 포함한 모든 노드에서** 아래의 명령어를 동일하게 수행
- 패킷 포워딩이 가능하도록 설정
- 방화벽 및 selinux를 해제하며, 
- 메모리 swapping을 비활성화하는 것이다.
```
# ipv4 포워딩 활성화(마스터 및 모든 노드)
[root@k8s-master ~] echo 1 > /proc/sys/net/ipv4/ip_forward

# firewalld 비활성화(마스터 및 모든 노드) (ubuntu 안깔려있음)
# 방화벽 상태 확인
[root@k8s-master ~] systemctl status firewalld 
[root@k8s-master ~] systemctl stop firewalld && systemctl disable firewalld

# SELinux 설정을 permissive 또는 disabled 로 변경(마스터 및 모든 노드)
# 설정 확인
cat /etc/sysconfig/selinux
[root@k8s-master ~] sed -i 's/^SELINUX=.*/SELINUX=disabled/g' /etc/sysconfig/selinux && cat /etc/sysconfig/selinux
[root@k8s-master ~] setenforce 0

# 스왑 메모리 끄기(마스터 및 모든 노드) swapoff -a 는 수행함..
[root@k8s-master ~] swapoff -a
vi /etc/fstab
swap 라인 주석처리

#시간 동기화(마스터 및 모든 노드)
yum install chrony
vi /etc/chrony.conf # 기존 time server 목록은 주석 처리
> apt install chrony
> vi /etc/chrony/chrony.conf
> time server 목록이 보이지 않음
> 
```

아래는 필수인지 잘 모르겠음..
```
# br_netfilter 커널 모듈 활성화  
modprobe br_netfilter
> echo '1' > /proc/sys/net/bridge/bridge-nf-call-iptables

# 재부팅 시 br_netfilter 로드  (먼진 모르겠지만 수행)
echo "br_netfilter" > /etc/modules-load.d/br_netfilter.conf
```


#### kubespray 다운로드
```
root@k8s-master ~] cd /opt
[root@k8s-master /opt] wget https://github.com/kubernetes-incubator/kubespray/archive/v2.5.0.tar.gz
[root@k8s-master ~] tar zxvf v2.5.0.tar.gz
```
or
```
git clone https://github.com/kubernetes-sigs/kubespray.git
cd kubespray
```



#### 기타 필요한 도구들 설치
- k8s-master 노드에서 다음의 명령어를 입력해 python3.6 를 비롯한 기타 필요한 도구들을 설치
```
> apt install python3
> apt install python3-pip
> 
# 필요 패키지 설치
> cd ~
> pip install -r requirements.txt

[root@compute3 kubespray]# cat requirements.txt 
ansible==3.4.0
ansible-base==2.10.11
cryptography==2.8
jinja2==2.11.3
netaddr==0.7.19
pbr==5.4.4
jmespath==0.9.5
ruamel.yaml==0.16.10
ruamel.yaml.clib==0.2.2
MarkupSafe==1.1.1

# 설치 확인
> pip show (패키지명)

```


#### hosts.yml 자동생성
- kubespray는 Ansible을 기반으로 클러스터를 제어함으로써 쿠버네테스를 설치하기 때문에, inventory 파일을 적절히 수정해 줄 필요가 있다.
-  inventory 샘플 파일이 inventory/sample/host.ini 경로에 존재하므로 이를 적절히 복사한 뒤 클러스터에 알맞는 설정을 적절히 입력해야 한다.
- 아래 명령어를 입력하면 자동으로 host.yml을 만들어준다.
-  파일의 상단에 호스트 명, ssh 접속 endpoint 및 쿠버네테스 네트워크 연결 & 외부 통신에 사용할 IP
-  kube-master, etcd, kube-node에 속할 노드의 이름을 해당 항목 아래에 명시

```
cp -rf inventory/sample/ inventory/mycluster
declare -a IPS=(10.0.2.10 10.0.2.11)
CONFIG_FILE=inventory/mycluster/hosts.yml python3 contrib/inventory_builder/inventory.py ${IPS[@]}
```
- `kube-master` 항목에 여러 개의 노드를 명시해 master 다중화를 할 수 있으나, 1개 이상의 `kube-master`는 반드시 `etcd` 항목에 명시되어 있어야 한다. 만약 `etcd` 항목에 1개 이상의 `kube-master` 노드가 존재하지 않는 경우, kubespray는 아래의 에러를 출력하며 쿠버네테스 설치에 실패하게 된다. 이는 etcd & kube-master 간의 인증서 공유 문제로 추측된다.


####  deploy
- ansible을 이용해 playbook을 수행
```
ansible-playbook --flush-cache -u root -b -i /opt/kubespray-2.5.0/inventory/inventory.cfg /opt/kubespray-2.5.0/cluster.yml
```

```
ansible-playbook -i inventory/mycluster/hosts.yml cluster.yml -b -v
```



#### 클러스터 삭제 (롤백)
- cluster.yml 대신 reset.yml 파일을 사용하면 쿠버네테스 클러스터를 말끔히 삭제할 수 있다. 쿠버네테스 설치 도중 에러가 발생했을 때 초기 상태로 되돌리는 용도로 자주 사용된다.
```
ansible-playbook -u root -b -i /opt/kubespray-2.5.0/inventory/inventory.cfg /opt/kubespray-2.5.0/reset.yml
```

