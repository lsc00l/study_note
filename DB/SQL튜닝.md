# SQL 튜닝
## MySQL Explain 항목 별 의미

| 항목            | 설명                               |
| ------------- | -------------------------------- |
| id            | select 아이디로 SELECT를 구분하는 번호      |
| table         | 참조하는 테이블                         |
| select_type   | select에 대한 타입                    |
| type          | 조인 혹은 조회 타입                      |
| possible_keys | 데이터를 조회할 때 DB에서 사용할 수 있는 인덱스 리스트 |
| key           | 실제로 사용할 인덱스                      |
| key_len       | 실제로 사용할 인덱스의 길이                  |
| ref           | Key 안의 인덱스와 비교하는 컬럼(상수)          |
| rows          | 쿼리 실행 시 조사하는 행 수립                |
| extra         | 추가 정보                            |
### id
- 실행 순서 표시
   - id가 작을수록 먼저 수행된 것
   - id가 같다면 테이블의 조인이 이루어진 것

### table
table 명

### select_type
- select문의 유형을 나타내는 항목

| 항목                   | 설명                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| SIMPLE               | 단순한 쿼리구문 UINION이나 내부쿼리가 없는                                                                       |
| PRIMARY              | 서브쿼리가 포함된 SQL문에서 첫번째 SELECT 문에 해당하는 구문에 표시 <br>서브쿼리를 감싸는 , UNION이 포함된 SQL문에서 첫번째로 SELECT가 작성된 구문 |
| SUBQUERY             | 독립적으로 수행되는 서브쿼리                                                                                  |
| DERIVED FROM         | 절에 작성된 서브쿼리라는 의미                                                                                 |
| UNION                | UNION / UNION ALL 구문에서 첫번째 SELECT 구문을 제외한 이후의 SELECT 구문                                          |
| UNION RESULT         | UNION 쿼리의 결과물                                                                                    |
| DEPENDEN SUBQUERY    | Sub Query 와 동일하나, 외곽쿼리에 의존적임 (값을 공급 받음)                                                          |
| DEPENDEN UNION       | UNION 또는 UNION ALL을 사용하는 서브쿼리가 메인 테이블의 영향을 받는 경우                                                 |
| UNCACHEABL SUBQUERKY | 메모리에 상주하여 재활용되어야 할 서브쿼리가 재사용되지 못할떄 출력되는 유형                                                       |

### partitions
- 실행계획의 부가 정보, 데이터가 저장된 논리적인 영역을 표시하는 항목

### type
- 테이블의 데이터를 어떻게 찾을지에 관한 정보를 제공하는 항목
- 테이블을 처음부터 끝까지 찾을것인지, 인덱스를 통해 바로 데이터를 찾아갈지 등 확인

| 항목              | 설명                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| system          | 테이블에 단 한개의 데이터만 있는 경우                                                                                                     |
| const           | SELECT에서 Primary Key 혹은 Unique Key를 살수로 조회하는 경우로 많아야 한 건의 데이터만 있음                                                         |
| eq_ref          | 조인을 할 때 Primary Key                                                                                                       |
| ref             | 조인을 할 때 Primary Key 혹은 Unique Key가 아닌 Key로 매칭하는 경우                                                                        |
| ref_or_null     | ref 와 같지만 null 이 추가되어 검색되는 경우                                                                                             |
| index_merge     | 두 개의 인덱스가 병합되어 검색이 이루어지는 경우                                                                                               |
| unique_subquery | 다음과 같이 IN 절 안의 서브쿼리에서 Primary Key가 오는 특수한 경우<br>SELECT *<br>FROM tab01<br>WHERE col01 IN (SELECT Primary Key FROM tab01); |
| index_subquery  | unique_subquery와 비슷하나 Primary Key가 아닌 인덱스인 경우로<br>SELECT *<br>FROM tab01<br>WHERE col01 IN (SELECT key01 FROM tab02);     |
| range           | 특정 범위 내에서 인덱스를 사용하여 원하는 데이터를 추출하는 경우로, 데이터가 방대하지 않다면 단순 SELECT 에서는 나쁘지 않음                                                 |
| index           | 인덱스를 처음부터 끝까지 찾아서 검색하는 경우로, 일반적으로 인덱스 풀스캔이라고 함                                                                            |
| all             | 테이블을 처음부터 끝까지 검색하는 경우로, 일반적으로 테이블 풀스캔이라고 함                                                                                |




