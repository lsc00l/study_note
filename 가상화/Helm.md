### Helm 이란
Chart라고 하는 k8s 패키지를 관리하는 도구다
CI/CD

### 역할
-   스크래치(scratch)부터 새로운 차트 생성
-   차트 아카이브(tgz) 파일로 차트 패키징
-   차트가 저장되는 곳인 차트 리포지터리와 상호작용
-   쿠버네티스 클러스터에 차트 인스톨 및 언인스톨
-   헬름으로 설치된 차트들의 릴리스 주기 관리


### three important concepts
1. chart
	- 쿠버네티스 애플리케이션의 인스턴스를 생성하는 데에 필요한 정보의 꾸러미
2. config
	- 릴리스 가능한 객체를 생성하기 위해 패키징된 차트로 병합될 수 있는 설정 정보를 가진다.
3. release
	- 차트의 구동중 인스턴스이며, 특정 config가 결합되어 있다.




## chart
YAML 파일의 묶음




helm

  

chart : 압축파일

        ㄴ 메타정보 template(deploy.yml + svc.yml)

        ㄴ 기타파일

  

제3자가

chart만 있으면 yml 이 포함되어있기 때문에






























