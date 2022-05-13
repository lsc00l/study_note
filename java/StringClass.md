# Java String Class
## String / StringBuffer / StringBuilder

Java 에서 문자열을 다루를 대표적인 클래스 세가지의 차이점과 특징을 정리해봤다.


## 1. `String`  vs `StringBuffer`/`StringBuilder` 

> 차이점 : 변경할 수 있는가?

### `String Class`
- 불변성(immutable)을 가진다.
	 	: 값이 한번 할당되면 주소가 변하지 않는다. 
- 변하지 않는 문자열을 자주 읽어들이는 경우 사용하는 것이 좋다.
### `StringBuffer/StringBuilder`
	
- 가변성(mutable)을 가진다.
		: .append() .delete() 등의 API를 이용하여 동일 객체내에서 문자열을 변경하는 것이 가능
- 문자열의 추가,수정,삭제가 빈번하게 발생할 경우에 사용하면 좋다.

## 2. `StringBuffer` vs `StringBuilder`
> 차이점 : 동기화를 지원하는가?

### `StringBuffer`
- 동기화 키워드를 지원
	 	: 동기화 키워드를 지원하여 멀티쓰레드 환경에서 안전하다는 점(thread-safe) 
	 	 * String도 불변성을 가지기때문에 멀티쓰레드 환경에서의 안정성(thread-safe)을 가지고 있다. 
	
    
### `StringBuilder`
- 동기화를 지원하지 않는다.
	 	: 멀티스레드 환경에서 사용하는 것은 적합하지 않지만 
- 단일쓰레드에서의 성능은 StringBuffer 보다 뛰어나다.
