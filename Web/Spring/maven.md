### maven 이란?

프로젝트를 **빌드**하고 **라이브러리를 관리**해주는 도구

  프로젝트를 진행하게 되면 단순히 자신이 작성한 코드만으로 개발하는 것이 아니라 많은 라이브러리들을 활용해서 개발을 하게 된다.
  Maven은 내가 사용할 라이브러리 뿐만 아니라 해당 라이브러리가 작동하는데 필요한 다른 라이브러리들까지 관리하여 네트워크를 통해 자동으로 다운 받아준다.

  Maven은 프로젝트의 전체적인 라이프사이클을 관리하는 도구이며, 많은 편리함과 이점이 있어 널리 사용되고 있다. 기존에는 Ant가 많이 사용되었지만 Maven이 Ant를 넘어서 더 많은 개발자들이 사용하게 되었고 비교적 최근에는 Gradle이 새롭게 나와 사용되고 있다.

### maven의 LifeCycle

[https://myjamong.tistory.com/153](https://myjamong.tistory.com/153)

maven 에서는 미리 정의하고 있는 빌드 순서가 있으며 이 순서를 라이프사이클이라고 한다. 라이프 사이클의 가 빌드 단계를 **Phase**라고 하는데 이런 Phase들은 의존관계를 가지고 있다.

각 phase에는 plugin이 존재하고 해당 plugin에서 수행 가능한 명령을 **goal** 이라고 합니다.

![](https://velog.velcdn.com/images/co_ol/post/763724b5-7120-47bd-b7f2-ca45541e2ec7/image.png)


Goals의 ":" 기준으로 앞은 plugin을 의미하고 뒷 부분은 해당 plugin의 goal을 뜻합니다.

![기본 라이프 사이클](https://velog.velcdn.com/images/co_ol/post/4695a184-ac47-4d49-92fd-dc4730b16616/image.png)


**< 기본(Default) 라이프사이클>**

- Validate : 프로젝트가 올바른지 확인학고 필요한 모든 정보를 사용할 수 있는 지 확인하는 단계
- Compile : 프로젝트의 소스코드를 컴파일하는 단계
         성공적으로 컴파일되면 target/classes 폴더가 만들어지고 컴파일된 class파일이 생성된다.
- Test : 유닛(단위) 테스트를 수행하는 단계(테스트 실패시 빌드 실패로 처리, 스킵 가능)
- Package : 실제 컴파일된 소스 코드와 리소스들을 jar등의 배포를 위한 패키지로 만드는 단계
- Verify : 통합테스트 결과에 대한 검사를 실행하여 품질 기준을 충족하는지 확인하는 단계
- Install : 패키지를 로컬 저장소에 설치하는 단계
    (local repository 즉, maven이 설치되어 있는 PC에 배포)
- Deploy : 만들어진 Package를 원격 저장소에 release하는 단계

**< clean 라이프사이클>**

- Clean : 이전 빌드에서 생성된 파일들을 삭제하는 단계

**< site 라이프사이클>**

- Site : 프로젝트 문서를 생성하는 단계

### POM - Project Object Model

pom은 Project Object Model 의 약자로 이름 그대로 Project Object Model의 정보를 담고있는 파일이다. 이 파일에서 주요하게 다루는 기능들은 다음과 같다.

- 프로젝트 정보 : 프로젝트의 이름, 개발자 목록, 라이센스 등
- 빌드 설정 : 소스, 리소스, 라이프 사이클별 실행한 플러그인(goal)등 빌드와 관련된 설정
- 빌드 환경 : 사용자 환경 별로 달라질 수 있는 프로파일 정보
- POM연관 정보 : 의존 프로젝트(모듈), 상위 프로젝트, 포함하고 있는 하위 모듈 등

POM은 pom.xml파일을 말하며 Maven의 기능을 이용하기 위해 POM이 사용된다.
