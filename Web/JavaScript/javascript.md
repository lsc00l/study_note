# 자바스크립트 동작 원리
https://blog.toycrane.xyz/%EC%A7%84%EC%A7%9C-%EC%89%BD%EA%B2%8C-%EC%95%8C%EC%95%84%EB%B3%B4%EB%8A%94-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC-c7fbdc44cc97

- 자바스크립트는 싱글 스레드
= call stack
  한번에 한가지 일만 처리한다.


## JS Engine
자바스크립트 엔진은 Javascript 코드를 이해하고 실행을 도와주는 녀석입니다. 
대표적인 JS engine으로 V8엔진(Chrome, Node.js에서 사용)이 있으며, 이외에도 각 브라우저 별로 여러가지 엔진들이 존재합니다. 자바스크립트 엔진은 크게 Memory Heap과 Call Stack으로 이루어져 있습니다.

Memory Heap
데이터를 임시 저장하는 곳으로, 함수나 변수, 함수를 실행할 때 사용하는 값들을 저장합니다.

Call Stack
코드가 실행되면 코드의 내부의 실행 순서를 기록해 놓고, 하나씩 순차적으로 진행할 수 있도록 도와주는 곳입니다.


자바스크립트에서 비동기처리가 필요한 이유
화면에서 서버로 데이터를 요청했을 때 서버가 언제 그 요청에 대한 응답을 할지도 모르는 상태에서 다른 코드를 실행 안하고 기다릴 수는 없기 때문이다

이 때 효과적으로 event를 관리하기 위해 필요한 것이 바로 `web API`와 `Callback Queue`, `event loop`입니다.


## Callback Function 

자바스크립트에서는 함수가 실행이 끝나면, 다음에 실행할 일을 정할 수 있는데 이 것을 Callback이라고 부릅니다.

setTimeout 이외에도 Callback 함수는 AJAX, Dom을 관리하는 event 등에 사용되며, javascript를 효과적으로 사용하기 위해선 반드시 알아야 하는 개념입니다.


## browser web APIs
browser web API 는 브라우저 안에 C++ 구현된 쓰레드로 주로 DOM event, AJAX request, setTimeout 등 비동기 이벤트를 처리합니다. 
javascript 싱글 쓰레드의 영향을 받지 않고, 독립적으로 이벤트를 처리할 수 있습니다.

## Callback Queue
Callback Queue 는 browser web API에 있는 event가 실행되고 나면 javascript에서 실행할 callback을 저장하고 있는 저장소

## event loop 
event loop는 Call Stack 비어있는지를 주기적으로 확인하여 Callback Queue에서 Callback function을 가져와 Call Stack에서 Javascript 코드가 실행될 수 있도록 돕는 역할을 합니다. event loop가 반복적으로 Call Stack이 비어있는지 확인 하는 것을 tick이라고 합니다.