# Spring Security

## 인증(Authentication)과 권한(Authorization)

#### 인증(Authentication)
- 사이트에 접속하려는 자가 누구인지 확인하는 절차이다. (사용자가 본인인지 확인)
- UsernamePassword를 통한 인증을 할 수 있다. (Session관리, Token관리)
- SNS로그인을 통한 인증 위임을 할 수도 있다.
#### 인가, 권한(Authorization)
- 사용자가 어떤 일을 할 수 있는지 권한 설정하는 절차이다.
- 특정 페이지/리소스에 접근할 수 있는지 권한을 판단한다.
Secured, PrePostAuthorize 어노테이션으로 쉽게 권한 체크를 할 수 있다.
- 비즈니스 로직이 복잡한 경우 AOP를 이용해 권한 체크를 해야한다.




![[Pasted image 20230103132344.png]]
the flow of Servlet and Spring Security when an HTTP request comes in.
Servlet 과 Spring Security의 흐름

- FilterChain 안에 Filter n개, servlet이 있다. 
- `DelegatingFilterProxy` : a bridge between Servlet and Spring’s ApplicationContext
- `FilterChainProxy` : Spring에서 Spring Security로 진입하는 곳
  
- FilterChainProxy 
	- conatins List$<$SecurityFilterChain$>$ 
	- SecurityFilterChain is Bean
-  List$<$Filter$>$  SecurityFilterChain.getFilters()

- VirtualFilterChain to make List$<$Filter$>$ like FilterChain.



### Filter Ordering  

![](/image/springSecurity_filterChain.png)


 - Filter chain 내에 filter들의 순서는 매우 중요하며, 실제로 사용하는 filter들과는 무관하게 순서는 아래와 같이 사용되어야 한다.  
 - `ChannelProcessingFilter` 다른 프로토콜을 redirect 하기 위해 필요  
 - `SecurityContextPersistenceFilter` SecurityContext 정보 SET-UP과 변경된 내용 복사와 관련된 필터  
 - `ConcurrentSessionFilter` SecurityContextHolder 기능 사용과 주체의 지속적인 요청을 반영을 하도록 SessionRegistry 업데이트에 사용  
 - `UsernamePasswordAuthenticationFilter` 인증 요청 토큰에 따라 SecurityContextHolder 변경  
 - `CasAuthenticationFilter` 인증 요청 토큰에 따라 SecurityContextHolder 변경  
 - `BasicAuthenticationFilter` 인증 요청 토큰에 따라 SecurityContextHolder 변경  
 - `SecurityContextHolderAwareRequestFilter` HttpServletRequestWrapper를 사용하는 경우 필요  
 - `JaasApiIntegrationFilter` JaasAuthenticationToken이 SecurityContextHolder에 존재하는 경우 Token의 Subject로 FilterChain을 사용  
 - `RememberMeAuthenticationFilter` 이전 인증 정보 업데이트가 없었던 경우 cookie를 이용해 적절한 Authentication 정보를 찾아내어 반환  
 - `AnonymousAuthenticationFilter` 이전 인증 정보 업데이트가 없었던 경우 anonymous Authentication 정보를 반환  
 - `ExceptionTranslationFilter` Spring Security exception을 catch하여 HTTP 에러 응답이 반환될 수 있도록 사용  
 - `FilterSecurityInterceptor` web URIs 보호 및 접근 불가시 exception 유발



https://docs.spring.io/spring-security/reference/servlet/architecture.html#servlet-security-filters

