# OTP

날짜: 2024년 1월 16일


## pom.xml

- Google otp 사용 위한 의존성 추가

```xml
<dependency>
    <groupId>com.warrenstrange</groupId>
    <artifactId>googleauth</artifactId>
    <version>1.4.0</version>
</dependency>
```

## OtpService.java

- OTP 관련 핵심 기능을 수행하는 서비스
- 핵심 기능 : `OTP 발급`, `QR 코드 생성`, `OTP 검증`

```java
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Scanner;

@Service
public class OtpService {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * Key 생성
     * @return
     */
    public GoogleAuthenticatorKey generateSecretKey() {
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        return gAuth.createCredentials();
    }

    /**
     * QR 코드 생성
     * @param accountName
     * @param secretKey
     * @return
     */
    public String generateQrCodeUrl(String accountName, String secretKey) {
         String url = "https://www.google.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/"
                + accountName + "?secret=" + secretKey;

//         logger.debug("QR URL %%%%%%%%%%%%%%%%%%%%% : {}", url);

        return url;

    }

    /**
     * OTP 인증코드 검증
     * @param secretKey
     * @param otpCode
     * @return
     */
    public boolean validateOtp(String secretKey, String otpCode) {
        GoogleAuthenticator gAuth = new GoogleAuthenticator();

        return gAuth.authorize(secretKey, Integer.parseInt(otpCode));
    }

}
```

## login-otp.jsp

![Untitled](/image/otplogin.png)

js 생략

```html
<c:url var="loginProcUrl" value="/j_spring_security_otp"/>

<div class="sign-logo">
  <div class="peers align-items-center flex-nowrap">
    <div class="peer">
      <div class="logo">
        <img src="/resources/img/sign/signin-logo.png" alt="SKT"/>
      </div>
    </div>
    <div class="peer peer-greed">
      <h1 class="logo-text"> SKT AIMS <small> AI Based Immersion Cooling </small><small> Management System </small>
      </h1>
    </div>
  </div>
</div>
<div class="sign-container peers align-items-stretch flex-nowrap">
  <div class="peer peer-greed">
    <div class="sign-spot"> 인공지능 기반 <br/>데이터센터 액침냉각 최적 운영 솔루션</div>
  </div>
  <div class="col-12 col-md-6 col-lg-5 peer">
    <div class="container">
      <div class="sign-form">
        <c:if test="${param.error eq '2'}">
          <p style="color:#a94442;text-align:center"><em>인증코드가 올바르지 않습니다.</em></p>
        </c:if>
        <c:if test="${param.error eq '3'}">
          <p style="color:#a94442;text-align:center"><em>OTP 인증이 필요합니다.</em></p>
        </c:if>
        <img src="/resources/img/sign/quote.png" class="mb-3" alt="quote"/>
        <div class="sign-form">
          <c:if test="${qrCodeUrl ne null}">
            <h2>OTP 인증 등록</h2>
          </c:if>
        </div>
      </div>
      <%--STEP1 --%>
      <div class="sign-form" step="1" style="display: none">
        <h2 class="mb-30 text-primary">Step 1</h2>
        <h5 class="mb-1">OTP 인증을 위해 Google Authenticator<br>앱을 설치해주세요.</h5>
        <hr class="mb-20"/>
        <div class="container mb-5">
          <div class="row align-items-center">
            <div class="col">
              <a href="https://apps.apple.com/us/app/google-authenticator/id388497605?itsct=apps_box_badge&amp;itscg=30200" style=" border-radius: 13px;">
                <img src="/resources/img/sign/app-store-badge.svg" alt="Download on the App Store" style="border-radius: 13px;" width="150px">
              </a>
            </div>
            <div class="col">
              <a href='https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pcampaignid=web_share&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                <img alt='Get it on Google Play' src='/resources/img/sign/google-play-badge.png' width="180px"/>
              </a>
            </div>
          </div>
        </div>
        <div class="peers justify-content-between align-items-center flex-nowrap mt-50">
          <button type="button" id="step1PrevBtn" class="btn btn-lg btn-secondary">취소</button>
          <button type="button" id="step1NextBtn" class="btn btn-lg btn-secondary">다음</button>
        </div>
      </div>
      <%--STEP1 END --%>
      <%--STEP2 --%>
      <div class="sign-form" step="2" style="display: none">
        <h2 class="mb-30 text-primary">Step 2</h2>
        <h5 class="mb-1">다운받은 Google Authenticator 앱에서<br>아래 QR 코드를 스캔하거나 설정키를 직접 입력하세요.</h5>
        <hr class="mb-20"/>
        <div class="container mb-5">
          <div class="row align-items-end">
            <div class="col">
              <img src="${qrCodeUrl}" width="150px">
            </div>
            <div class="col">
              <div class="input-group outline mb-3">
                <input id="secretKey" class="form-control form-control-lg" type="text" value="${secretKey}" readonly="readonly">
                <span class="input-group-text">
              <i class="ri-clipboard-line" id="copyCode"></i>
            </span>
              </div>
            </div>
          </div>
        </div>
        <div class="peers justify-content-between align-items-center flex-nowrap mt-50">
          <button type="button" id="step2PrevBtn" class="btn btn-lg btn-secondary">이전</button>
          <button type="button" id="step2NextBtn" class="btn btn-lg btn-secondary">다음</button>
        </div>
      </div>
      <%--STEP2 END --%>

      <%--STEP3 --%>
      <div class="sign-form" step="3" style="display: none">
<%--        <form id="loginFrm" name="loginFrm" class="sign-form" method="post" action="/otp.app">--%>
        <form id="loginFrm" name="loginFrm" method="post" action="${loginProcUrl}">
          <input type="hidden" id="newKey" name="newKey" value="${secretKey}">
          <c:if test="${qrCodeUrl ne null}">
            <h2 class="mb-30 text-primary">Step 3</h2>
            <h5 class="mb-1">인증코드 입력</h5>
          </c:if>
          <c:if test="${qrCodeUrl eq null}">
            <h3 class="mb-1">OTP 인증</h3>
          </c:if>
          <hr class="mb-40"/>
          <div class="mb-5">
            <label class="form-label">OTP 6자리 숫자 인증코드</label>
            <div class="input-group outline mb-3">
              <span class="input-group-text"><i class="ri-shield-keyhole-line fs-20 opacity-50"></i></span>
              <input type="number"
                     id="otp"
                     name="otp"
                     class="form-control form-control-lg"
                     placeholder="<spring:message code="label.user.otp" />"
                     maxlength="6"
                     required>
              <span class="input-group-text" id="clearBtn"><i class="ri-close-line"></i></span>
            </div>
          </div>
          <div class="mt-30">
            <button type="submit" class="btn btn-lg btn-secondary w-100"><spring:message code="button.login"/></button>
          </div>
          <c:if test="${qrCodeUrl eq null}">
            <div class="peers justify-content-end align-items-center flex-nowrap mt-3">
              <div class="peer">
                <a href="/logout" class="fw-500 text-decoration-underline">로그아웃</a>
              </div>
              <div class="peer">
                <a href="/otp-gen.app" class="fw-500 text-decoration-underline ms-2">OTP 발급</a>
              </div>
            </div>
          </c:if>
          <c:if test="${qrCodeUrl ne null}">
            <div class="peers justify-content-start align-items-center flex-nowrap mt-3">
              <div class="peer">
                <a href="javascript:void(0)" id="step3PrevBtn" class="btn btn-link text-decoration-none">이전</a>
              </div>
            </div>
            <%--<div class="peers justify-content-start align-items-center flex-nowrap mt-50">
              <button type="button" id="step3PrevBtn" class="btn btn-lg btn-secondary">이전</button>
            </div>--%>
          </c:if>
        </form>
      </div>
      <%--STEP3 END --%>
    </div>

  </div>
</div>
```

## LoginController.java

- 기존 `LoginController` 에
- `otp 페이지` 요청, `otp 발급` 요청 컨트롤러 추가

```java
@Controller
public class LoginController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private OtpAuthenticationProvider otpAuthenticationProvider;

		private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/otp.app", method = RequestMethod.GET)
    public String showOTPLoginForm(Authentication authentication) {

        if(authentication.equals(null)){
            throw new SessionAuthenticationException("Session Expired");
        }

        return "login/login-otp";

    }

    /**
     * OTP 발급
     * @param authentication
     * @return
     */
    @RequestMapping(value = "/otp-gen.app", method = RequestMethod.GET)
    public ModelAndView generateOtpSecretKey(Authentication authentication) {

        ModelAndView mav = new ModelAndView();
        AppAuthUser user = (AppAuthUser)authentication.getPrincipal();

        /* 1. otp secret key 생성 */
        GoogleAuthenticatorKey key = otpService.generateSecretKey();
        String secretKey = key.getKey();

        /* 2. secretKey QR code 생성 */
        String qrCodeUrl = otpService.generateQrCodeUrl(user.getUserId(), secretKey);

        mav.addObject("secretKey", secretKey);
        mav.addObject("qrCodeUrl", qrCodeUrl);
        mav.addObject("accountName", user.getUserId());
        mav.setViewName("login/login-otp");
        return mav;

    }
}
```

---

# Spring Security 관련 설정

## GoogleOtpFilter.java

- OTP 로그인 요청이 들어왔을 때 수행되는 필터
- `AbstractAuthenticationProcessingFilter` 을 상속 받아 구현
- 새로 발급 받은 secret key 라면 DB저장
- `OtpAuthenticationProvider` 에게 검증 과정 위임
- 모든 과정 성공 시 `OtpAuthenticationSuccessHandler` 수행

```groovy
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GoogleOtpFilter extends AbstractAuthenticationProcessingFilter {

    @Autowired
    private UserInfoService userInfoService;

    @Autowired
    private OtpAuthenticationProvider otpAuthenticationProvider;

    public GoogleOtpFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);

    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException, ServletException {
        String otp = obtainOtp(request);

       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AppAuthUser user = (AppAuthUser) authentication.getPrincipal();

        // 새로 발급 받은 키라면 DB에 저장
        if(!request.getParameter("newKey").isEmpty()){

            String newKey = request.getParameter("newKey");
            if(newKey.length() > 0){
                user.setOtpKey(newKey);
                userInfoService.updateOtpKey(user);
            }

        }
        // OTP를 추가로 저장합니다.
        ((UsernamePasswordAuthenticationToken) authentication).setDetails(otp);

        // 새로운 Authentication 객체를 생성하여 인증을 완료합니다.
        Authentication authenticationResult = otpAuthenticationProvider.authenticate(authentication);

        // 인증 성공 후 SecurityContext에 새로운 Authentication을 설정합니다.
        SecurityContextHolder.getContext().setAuthentication(authenticationResult);

        return authenticationResult;
    }

    private String obtainOtp(HttpServletRequest request) {
        return request.getParameter("otp");
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {

        // 새로운 Authentication 객체 생성
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        new OtpAuthenticationSuccessHandler().onAuthenticationSuccess(request, response, auth);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        response.sendRedirect("/otp.app?error=2");
    }
}
```

### AppSecurityConfig.java에 GoogleOtpFilter관련 설정 추가

```java
@Autowired
GoogleOtpFilter googleOtpFilter;

@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {

		httpSecurity
				.addFilterBefore(googleOtpFilter, UsernamePasswordAuthenticationFilter.class);

}

@Bean
public GoogleOtpFilter googleOtpFilter(AuthenticationManager authenticationManager) throws Exception {
    GoogleOtpFilter otpFilter = new GoogleOtpFilter("/j_spring_security_otp");

    otpFilter.setAuthenticationManager(authenticationManagerBean());
    return otpFilter;
}
```

## OtpAuthenticationProvider.java

- otp 검증을 수행
- 사용자 정보에서 secret key 정보를 가져와 otp 인증 번호 검증
- 검증 성공 후 `Authentication` 객체에 `OTP_VERIFIED` 정보 추가
- 실패 시 예외 던짐

```java
import com.app.web.model.security.AppAuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OtpAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private OtpService otpService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

        // 사용자가 제공한 ID, Password 및 OTP를 가져옵니다.
        String userId = authentication.getName();
        String userProvidedOtp = "";

        boolean hasOtp = authentication.getDetails() instanceof String;

        //otp인증번호가 없음, 아직 폼로그인 단계
        if(!hasOtp){

            //예외를 던짐 -> LoginFailureHandler.java 에서 받아줌
            throw new BadCredentialsException("Missing OTP");
        }else{
            userProvidedOtp = (String) authentication.getDetails();
        }

        //OTP 검증 로직을 수행
        AppAuthUser user = (AppAuthUser)authentication.getPrincipal();

        if(isValidOtp(user, userProvidedOtp)){
            List<GrantedAuthority> authorities = new ArrayList<>(authentication.getAuthorities());
            authorities.add(new SimpleGrantedAuthority("OTP_VERIFIED"));

            return new UsernamePasswordAuthenticationToken(authentication.getPrincipal(), authentication.getCredentials(), authorities);
        } else {
            // OTP 검증이 실패 , 예외를 던져서 인증 실패를 알립니다.
            throw new BadCredentialsException("Invalid OTP");
        }

    }

    /**
     * OTP 검증 */
    private boolean isValidOtp(UserDetails userDetails, String otp) {

        String secretKey = ((AppAuthUser) userDetails).getOtpKey();
        return otpService.validateOtp(secretKey, otp);

    }

    @Override
    public boolean supports(Class<?> authentication) {
        // UsernamePasswordAuthenticationToken을 지원하도록 설정합니다.
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
```

### AppSecurityConfig.java 에 OtpAuthenticationProvider 관련 설정 추가

```java
@Autowired
private AuthenticationProvider otpAuthenticationProvider;

@Override
protected void configure(AuthenticationManagerBuilder authBuilder) throws Exception {
    
    authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    authBuilder.authenticationProvider(otpAuthenticationProvider);
}

@Bean
public AuthenticationManager authenticationManagerBean(AuthenticationManagerBuilder builder,
                                                        AuthenticationProvider otpAuthenticationProvider) throws Exception {
    builder.authenticationProvider(otpAuthenticationProvider());
    return builder.build();
}

@Bean
public AuthenticationProvider otpAuthenticationProvider() {
    return new OtpAuthenticationProvider();
}
```

## OtpAuthenticationSuccessHandler.java

- OTP 인증 성공 하면 해당 핸들러로

```java
import com.app.web.config.security.service.AppUserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class OtpAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    AppUserService appUserService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth) throws IOException, ServletException {

        logger.debug("OTP LOGIN SUCCESSFUL......");

        setDefaultTargetUrl("/index.app");

        DefaultSavedRequest savedRequest = (DefaultSavedRequest) request.getSession().getAttribute("SPRING_SECURITY_SAVED_REQUEST");
        // DefaultSavedRequest에 error 페이지가 있다면 DefaultSavedRequest 관련 정보 null로 변경
        if (savedRequest != null && savedRequest.getRequestURI().contains("errors")) {
            request.getSession().setAttribute("SPRING_SECURITY_SAVED_REQUEST", null);
        }

        super.onAuthenticationSuccess(request, response, auth);

    }
}
```

### 기존 LoginSuccess.java 수정

- 기존 : 폼로그인 성공 후 대시보드로 이동
- 수정 후 : 폼로그인 성공 후 otp 2차 로그인 페이지로 이동

```java
@Component
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth) throws IOException, ServletException {

        logger.debug("FORM LOGIN SUCCESSFUL......");

        SecurityContextHolder.getContext().setAuthentication(auth);

        setDefaultTargetUrl("/otp.app");
        response.sendRedirect("/otp.app");
    }

}
```

## 기존 LoginFailureHandler.java 수정

- 기존 : 폼로그인 예외만 존재
- 수정 후 : otp 인증에 관련된 예외 추가

```java
@Component
public class LoginFailuerHandler extends SimpleUrlAuthenticationFailureHandler {
	
	private final Logger logger = LoggerFactory.getLogger(this.getClass());
	private AuthUserMapper authUserMapper;
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException authEx) throws IOException, ServletException {

        logger.debug("LOGIN FAILED......");

        /* 실패한 AuthenticationException에서 실패 이유를 확인 */

        // OTP 인증을 안한 경우 -> otp 인증 페이지로 리다이렉트
        if (authEx instanceof BadCredentialsException && "Missing OTP".equals(authEx.getMessage())) {
            logger.debug("OTP authentication is required.......");

            response.sendRedirect(request.getContextPath() + "/otp.app");
            super.onAuthenticationFailure(request, response, authEx);

        } else if(authEx instanceof BadCredentialsException && "Invalid OTP".equals(authEx.getMessage())) {
						//인증 번호가 틀린 경우
            response.sendRedirect(request.getContextPath() + "/otp.app?error=2");

        }

		if (authEx instanceof SessionAuthenticationException) {

			setDefaultFailureUrl("/sessionExpired.app");

		} else {
            Object accessCnt = request.getAttribute("accessCnt");

			if (accessCnt != null && "N".equals(accessCnt)) {
				setDefaultFailureUrl("/loginForm.app?error=2");
			}else {
                setDefaultFailureUrl("/loginForm.app?error=1");
            }

		}

        super.onAuthenticationFailure(request, response, authEx);
	
	}

}
```

## OtpAuthenticationVerificationFilter.java

- 웹으로 들어오는 모든 요청에 대해 otp 검증 여부를 확인하는 필터

```groovy
package com.app.web.config.servlet.filter;

import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Component
@Order(1)
/**
 * OTP 인증 절차 수행여부 확인 Filter
 */
public class OtpAuthenticationVerificationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 권한 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAuthenticatedUser = (authentication instanceof AnonymousAuthenticationToken) || Objects.isNull(authentication);
        boolean sessionIsNull = request.getSession(false) == null;

        // 아직 사용자 인증 전이라면 return
        if ((authentication instanceof AnonymousAuthenticationToken) || Objects.isNull(authentication)) {

            filterChain.doFilter(request, response);// 필터 체인 계속 진행
            return;
        }

        /* OTP 인증 절차 수행 확인 */
        String requestUrl = request.getRequestURI();
        // "otp.app", "otp-gen.app" 등 otp 관련 페이지에서 수행 중이라면 skip
        if (!requestUrl.contains("otp")) {

            if (!isOtpVerificationCompleted(authentication)) {

                throw new BadCredentialsException("Missing OTP");
            }
        }

        filterChain.doFilter(request, response);

    }

    /**
     * OTP 인증 상태를 확인하고 true/false 반환
     * @param authentication
     * @return
     */
    private boolean isOtpVerificationCompleted(Authentication authentication) {
        // authority에  "OTP_VERIFIED" 권한 있는지 확인
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "OTP_VERIFIED".equals(authority.getAuthority()));
    }
}
```

### AppSecurityConfig.java 에 OtpAuthenticationProvider 관련 설정 추가

```java
@Autowired
OtpAuthenticationVerificationFilter otpAuthenticationVerificationFilter;

httpSecurity
		.addFilterBefore(otpAuthenticationVerificationFilter, UsernamePasswordAuthenticationFilter.class);
```

## 참고) AppSecurityConfig.java 전체 코드

> `@Configuration`
`@EnableWebSecurity`
AppSecurityConfig extends `WebSecurityConfigurerAdapter`
> 

```groovy
import com.app.web.config.security.otp.GoogleOtpFilter;
import com.app.web.config.security.otp.OtpAuthenticationProvider;
import com.app.web.config.servlet.filter.OtpAuthenticationVerificationFilter;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.builders.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.access.*;
import org.springframework.security.web.access.intercept.*;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.authentication.session.*;
import org.springframework.security.web.session.*;

@Configuration
@EnableWebSecurity
public class AppSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	FilterSecurityInterceptor filterSecurityInterceptor;
	
	@Autowired
	AuthenticationSuccessHandler successHandler;
	
	@Autowired
	AuthenticationFailureHandler failureHandler;
	
	@Autowired
	AccessDeniedHandler accessDeniedHandler;
	
	@Autowired
	ConcurrentSessionFilter concurrencyFilter;
	
	@Autowired
	UsernamePasswordAuthenticationFilter usernamePasswordAuthenticationFilter;
	
	@Autowired
	CompositeSessionAuthenticationStrategy compositeSessionAuthenticationStrategy;
	
	@Autowired
	BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	UserDetailsService userDetailsService;

    @Autowired
    OtpAuthenticationVerificationFilter otpAuthenticationVerificationFilter;

    @Autowired
    private AuthenticationProvider otpAuthenticationProvider;

    @Autowired
    GoogleOtpFilter googleOtpFilter;

    private static final String[] PERMIT_ADM_ONLY
            = {"/mng/commonCode.app", "/mng/commonCodeDetail.app", "/mng/detailMenu.app", "/mng/menu.app", "/mng/site.app", "/mng/userDetail.app", "/mng/users.app"};

    private static final String[] PERMIT_ADM_OPE
            = {"/mng/device.app", "/mng/deviceDetail.app", "/mng/server.app", "/site-index.app"};
        
    private static final String[] PERMIT_ALL_AUTH
            = {"/mng/serverDetail.app", "/oper/failureHist.app", "/oper/operHist.app", "/result/result.app", "/result/simulator.app"};

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {

		httpSecurity
			    .addFilterBefore(filterSecurityInterceptor, FilterSecurityInterceptor.class)
				.authorizeRequests()
                .antMatchers("/loginForm.app").permitAll()
                .antMatchers("/resources/**", "/sessionExpired.app", "/accessDenied.app").permitAll()
                .antMatchers(PERMIT_ADM_ONLY).access("hasAnyRole('ROLE_ADMIN')")
                .antMatchers(PERMIT_ADM_OPE).access("hasAnyRole('ROLE_ADMIN', 'ROLE_OPE_1', 'ROLE_OPE_2', 'ROLE_OPE_3', 'ROLE_OPE_4')")
                .antMatchers(PERMIT_ALL_AUTH).access("hasAnyRole('ROLE_ADMIN', 'ROLE_OPE_1', 'ROLE_OPE_2', 'ROLE_OPE_3', 'ROLE_OPE_4', 'ROLE_SKT')")
				.antMatchers("/mng/**").access("hasAnyRole('ROLE_ADMIN')")
                .antMatchers("/rest/**").access("hasAnyRole('ROLE_ADMIN', 'ROLE_OPE_1', 'ROLE_OPE_2', 'ROLE_OPE_3', 'ROLE_OPE_4', 'ROLE_SKT')")
				.antMatchers("/**/**/.app").access("hasAnyRole('ROLE_ADMIN', 'ROLE_OPE_1', 'ROLE_OPE_2', 'ROLE_OPE_3', 'ROLE_OPE_4', 'ROLE_SKT')")
				.antMatchers("/**/**/.json").access("hasAnyRole('ROLE_ADMIN', 'ROLE_OPE_1', 'ROLE_OPE_2', 'ROLE_OPE_3', 'ROLE_OPE_4', 'ROLE_SKT')")
				.anyRequest().authenticated()
				.and()
			.exceptionHandling()
				.accessDeniedHandler(accessDeniedHandler)
			.and()
			.formLogin()
				.loginPage("/loginForm.app")
				.loginProcessingUrl("/j_spring_security_check")
				.usernameParameter("userId")
				.passwordParameter("userPw")
				.successHandler(successHandler)
				.failureHandler(failureHandler)
            .and()
                .addFilterBefore(googleOtpFilter, UsernamePasswordAuthenticationFilter.class)
			.logout()
				.logoutUrl("/logout")
				.logoutSuccessUrl("/loginForm.app")
				.deleteCookies("JSESSIONID")
				.invalidateHttpSession(true)
			.and()
			.csrf()
				.disable()
			.headers()
				.frameOptions()
					.sameOrigin();

		httpSecurity
			.addFilterBefore(concurrencyFilter, ConcurrentSessionFilter.class)
			.sessionManagement()
				.sessionAuthenticationStrategy(compositeSessionAuthenticationStrategy);

        httpSecurity.addFilterBefore(otpAuthenticationVerificationFilter, UsernamePasswordAuthenticationFilter.class);

    }
	
	@Override
	public void configure(WebSecurity webSecurity) throws Exception {
		
		webSecurity
			.ignoring().antMatchers("/resources/**")
				.and()
			.privilegeEvaluator(webInvocationPrivilegeEvaluator());
	
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder authBuilder) throws Exception {
		
		authBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
        authBuilder.authenticationProvider(otpAuthenticationProvider);
	
	}
	
	@Override
	protected UserDetailsService userDetailsService() {
		
		return userDetailsService;
	
	}

	@Bean
	public AuthenticationManager authenticationManagerBean(AuthenticationManagerBuilder builder) throws Exception {
        builder.authenticationProvider(otpAuthenticationProvider());
        return builder.build();
	}

    @Bean
    public AuthenticationProvider otpAuthenticationProvider() {
        return new OtpAuthenticationProvider();
    }

	@Bean
	public WebInvocationPrivilegeEvaluator webInvocationPrivilegeEvaluator() {
		
		return new DefaultWebInvocationPrivilegeEvaluator(filterSecurityInterceptor);
	
	}

    @Bean
    public GoogleOtpFilter googleOtpFilter(AuthenticationManager authenticationManager) throws Exception {
        GoogleOtpFilter otpFilter = new GoogleOtpFilter("/j_spring_security_otp");

        otpFilter.setAuthenticationManager(authenticationManagerBean());
        return otpFilter;
    }

}
```