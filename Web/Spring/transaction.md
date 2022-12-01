# Transaction

## Transaction 
트랜잭션이란 '더이상 쪼갤 수 없는 최소 작업 단위'를 말한다.
<br/><br/>
작업 진행 중 예외 발생 시에 이전 상태로 롤백하기 위해 사용한다. <br>

작업수행 정상 여부에 따라 `commit` 또는 `rollback`을 자동으로 수행한다. <br/>
`begin` , `commit`을 자동으로 수행해준다.
<br/><br/>

## 스프링에서의 트랜잭션 처리 방법
트랜잭션 처리가 필요한 메소드, 클래스, 인터페이스 위에 `@Transactional`  어노테이션을  추가한다.<br/>
어노테이션이 적용된 범위에서는 프록시 객체가 생성되어 commit/rollback 작업을 수행한다.<br/>

테스트 환경에서 `@Transactional` 을 사용하면 메서드가 종료될 때 자동으로 롤백된다.
<br/><br/>
Auto Increment 옵션은 트랜잭션 범위의 밖에서 동작하기 때문에,

insert 작업으로 인해 증가한 Auto Increment 옵션이 적용된 컬럼은 트랜잭션이 롤백되어도 감소하지 않는다.

<br/><br/>

# @Transactional 옵션
## 1. isolation (격리레벨)
: 일관성이 없는 데이터를 허용하는 수준

``` java
@Transactional(isolation=Isolation.DEFAULT)
```
- DEFAULT : 기본 격리 수준
    - DB의 isolation lebel을 따른다. <br/><br/>
- READ_UNCOMMITED (level 0) : 커밋되지 않는 데이터에 대한 읽기를 허용
    - 다른 트랜잭션에서 커밋되지 않은 데이터를 읽을 수 있다. (=Dirty read)<br/><br/>
- READ_COMMITED (level 1) : 커밋된 데이터에 대해 읽기 허용
    - 커밋이 완료된 데이터만 select 시에 보이는 수준
    - non-repeatable Read 라고도 한다.<br/><br/>
- REPEATEABLE_READ (level 2) : 동일 필드에 대해 다중 접근 시 모두 동일한 결과를 보장
    - 트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 shared lock이 걸리므로 다른 사용자는 그 영역에 해당되는 데이터에 대한 수정이 불가능하다.
    -  한 트랜잭션 안에서 반복해서 SELECT를 수행하더라도 읽어 들이는 값이 변화하지 않음을 보장합니다.<br/><br/>
- SERIALIZABLE (level 3) : 가장 높은 격리, 성능 저하의 우려가 있음
    -  데이터의 일관성 및 동시성을 위해 MVCC(Multi Version Concurrency Control)을 사용하지 않음.
    - *MVCC : 다중 사용자 데이터베이스 성능을 위한 기술로 데이터 조회 시 LOCK을 사용하지 않고 데이터의 버전을 관리해 데이터의 일관성 및 동시성을 높이는 기술
    - 트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 shared lock이 걸리므로 다른 사용자는 그 영역에 해당되는 데이터에 대한 수정 및 입력이 불가능하다.


<br/><br/>

## 2. propagation (전파속성)
``` java
@Transactional(propagation=Propagation.REQUIRED)
```

- REQUIRED : 부모 트랜잭션 내에서 실행하며 부모 트랜잭션이 없을 경우 새로운 트랜잭션을 생성
- REQUIRES_NEW : 부모 트랜잭션을 무시하고 무조건 새로운 트랜잭션이 생성
- SUPPORT : 부모 트랜잭션 내에서 실행하며 부모 트랜잭션이 없을 경우 nontransactionally로 실행
- MANDATORY : 부모 트랜잭션 내에서 실행되며 부모 트랜잭션이 없을 경우 예외가 발생
- NOT_SUPPORT : nontransactionally로 실행하며 부모 트랜잭션 내에서 실행될 경우 일시 정지
- NEVER : nontransactionally로 실행되며 부모 트랜잭션이 존재한다면 예외가 발생
- NESTED : 해당 메서드가 부모 트랜잭션에서 진행될 경우 별개로 커밋되거나 롤백될 수 있음. 둘러싼 트랜잭션이 없을 경우 REQUIRED와 동일하게 작동

<br/><br/>

## 3. readOnly  (읽기전용)
- default : false
- INSERT, UPDATE, DELETE 작업을 해도 반영되지 않거나, DB 종류에 따라 예외가 발생하는 경우도 있다.
- 성능 향상을 위해 사용하거나 SELECT 외의 동작을 막기 위해 사용
``` java
@Transactional(readonly = true)
```

<br/><br/>

## 4. rollbackFor
- default : RuntimeException, Error
- 특정 예외 발생 시 rollback
``` java
@Transactional(rollbackFor=Exception.class)
```
- @Transactional 은 기본적으로 Unchecked Exception, Error 만을 rollback하고 있다.


<br/><br/>

## 5. timeout
- default : -1 (no timeout)
- 지정 시간 내에 작업 수행이 완료되지 않으면 rollback
``` java
@Transactional(timeout=10)
```
