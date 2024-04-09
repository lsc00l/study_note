# Spring Security JWT



https://waynestalk.com/en/spring-security-jwt-jpa-springdoc-explained-en/
## Form Login
- 초기의 웹 페이지는 PHP, ASP, JSP와 같은 백엔드에서 출력
- 이러한 아키텍처에서 프런트엔드와 백엔드는 쿠키를 사용하여 세션 ID를 기록하고 세션 ID로 사용자가 로그인했는지 여부를 확인

→  Form Login 방식

## JWT-Token-Based Authentication
- 그러나 Form Login과 같은 인증 프로세스는 쿠키 때문에 모바일에서 구현하기 쉽지 않습니다. 모바일은 쿠키를 사용하지 않으며 코드 출력을 위한 백엔드가 필요하지 않습니다. 모바일은 백엔드의 데이터만 필요합니다. 
- In order to meet the needs of the mobile phone, 백엔드는 쿠키를 사용하지 않는 확인 방법을 제공해야 합니다.
-  그 중 하나가 토큰을 사용하는 방식이다.
- 간단히 말해서 쿠키에 넣은 것을 대신 HTTP 요청 헤더에 넣는 것입니다. 
- Spring Security는 Basic Authentication ,  Digest Authentication을 제공합니다. 
- 이 두 프로세스는 Form Login과 동일한 Username-and-Password 인증이지만 토큰 인증을 기반으로 합니다.

## JWT-Token-Based Authentication Flow

![](/image/jwt_ahtentication_flow.png)

- Spring Security에서 흐름을 구현하기 위한 아이디어는 
- SecurityFilterChain에 JwtFilter를 삽입하는 것입니다. 
	- HTTP 요청 헤더에서 JWT 토큰을 얻고 수신된 JWT 토큰이 유효한지 확인합니다. 
	- 마지막으로 JWT 토큰을 인증 개체로 변환하고 SecurityContextHolder로 설정합니다. 이는 이 HTTP 요청 또는 세션이 인증되었음을 의미합니다.

- 그렇다면 헤더에 JWT 토큰이 없거나 JWT 토큰이 불법이면 FilterSecurityInterceptor에서 예외가 발생하고 ExceptionTranslationFilter가 이 예외를 처리합니다. 
- 원래 흐름에서 authenticationEntryPoint.commence() 및 ccessDeniedHandler.handle() 모두 리디렉션을 수행합니다. 
- 그러나 이제 오류 메시지만 반환하기를 원하므로 이 두 메서드를 다시 구현해야 합니다.

- POST /login이 들어오면 허가 없이 /login을 설정하기 때문에 JwtFilter, ExceptionTranslatorFilter 및 FilterSecurityInterceptor를 전달합니다. 
- 따라서 결국 LoginController.login()에 도달하게 됩니다.

- LoginController.login()은 사용자를 인증하고 JWT 토큰을 반환합니다. 
- 그 후 프론트엔드는 이 JWT 토큰을 사용하여 백엔드의 API에 액세스할 수 있습니다.








### REFERENCE
1.  [AbstractAuthenticationToken](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/authentication/AbstractAuthenticationToken.html) 과 [UsernamePasswordAuthenticationToken](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/authentication/UsernamePasswordAuthenticationToken.html) 의 관계

https://velog.io/@park2348190/Spring-Security-%EA%B8%B0%EB%B0%98-JWT-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84


2. 인증 서버 구축, JWT 인증서버를(Spring cloud) API Gateway로 두고 마이크로 서비스 이용하도록 함

https://velog.io/@bum12ark/MSA-JWT-%EC%9D%B8%EC%A6%9D-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0-1.-%EB%A1%9C%EA%B7%B8%EC%9D%B8


3.  스프링 클라우드 설명
https://www.samsungsds.com/kr/insights/spring_cloud.html

4.  Spring-Cloud-Gateway-JWT-인증
https://velog.io/@csh0034/Spring-Cloud-Gateway-JWT-%EC%9D%B8%EC%A6%9D

5. Spring cloud Gateway 공식 문서
https://docs.spring.io/spring-cloud-gateway/docs/3.0.2/reference/html/#gateway-starter












