# var, const, let
javascript의 변수 선언 키워드 var, const, let 에 대해 알아보자.

const와 let는 ES6에서 추가되었다.

## var
- 변수의 재선언과 재할당이 가능하다. 
``` js
    var name = "Kim";
    var name = "Lee"; //재선언 가능
    
    var vehicle = "bus";
    vehicle = "car"; // 재할당 가능
```


## const

- 재선언과 재할당이 불가능하다.
- const가 let과 다른 점이 있다면, 반드시 선언과 초기화를 동시에 진행되어야 한다.
- 객체의 재할당은 가능하다.

``` js
    const name; //Uncaught SyntaxError: Missing initializer in const declaration
    const name = 'Lee'
```


## let
- 중복 선언이 불가하지만, 재할당은 가능하다.


## hoisting
- 변수의 선언부를 상단으로 올려주는것
- `let` 키워드는 선언 단계와 초기화 단계가 분리되어 진행된다.<br>
즉, 런타임 이전에 자바스크립트 엔진에 의해 선언 단계가 먼저 실행되지만, 초기화 단계가 실행되지 않았을 때 해당 변수에 접근하려고 하면 참조 에러가 뜬다.<br>
(스코프의 시작 지점부터 초기화 단계 시작 지점까지 변수를 참조할 수 없는 일시적 사각지대(Temporal Dead Zone: TDZ) 구간이 존재한다.)

```js
    console.log(name) //Uncaught ReferenceError: name is not defined
    let name = 'Lee'
```
- const 키워드는 선언 단계와 초기화 단계가 동시에 진행된다.
```js    
    console.log(name) //Uncaught ReferenceError: Cannot access 'name' before initialization
    const name = 'Lee'
```
var을 쓰지않고 const/let을 사용하는 이유는 var의 hoisting현상을 피하기 위함이다.<br><br>


## block scope 
- `var` : function scope
- `const`, `let` : block scope
<br><br>

- `var` 로 선언한 경우 block scope 안에서 선언되었음에도 불구하고 scope 밖에서도 접근할 수 있다.<br>
- `var` 은 block scope 가 아닌 function scope 를 따른다.

``` js
    if(true){
        var num = 10;
    }
    console.log(num);

    // 10
```
``` js
    function myFunc(){
        var num = 10;
    }
    console.log(num);

    // Uncaught ReferneceError
```
- `const` 과 `let` 은 block scope 를 따른다.
``` js
    if (true){
        const num = 10;
    }
    console.log(num);

    //Uncaught ReferneceError
```

