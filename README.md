# 정글 이스케이프
~~https:/jungle-escape.site~~  
~~* 모바일을 지원하지 않습니다 😱🙀 키보드가 필요해요!~~  
~~* 크롬이 접속되지 않을 경우, 다른 브라우저로 시도 부탁드려요.~~  

https://youtu.be/VE9g69XFN3Q
* 유튜브 발표영상

<br><br>

## 목차
1. [소개](#1-소개)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [포스터](#3-포스터)
4. [Try-errors](#4-try-errors)
5. [Script](#5-script)

<br><br>
   
## 1. 소개
![Feb-23-2024 19-49-32](https://github.com/jungle-escape/jungle-escape/assets/145897206/ab113649-63f0-440d-8a87-f4a858593ac6)
<br><br>
크래프톤 정글 3기 쌈마이팀의 '나만의 무기 가지기' 프로젝트 결과물입니다.
<br>
🌐 **정글 이스케이프는 WebGL 세션 기반 멀티플레이어 러너 게임입니다.** 
<br>
🎮 **4명의 동시 멀티플레이를 지원하며, 3D physics에 기반한 유저-유저, 유저-월드 상호작용을 지원합니다.** 
<br>
🏃 **크래프톤 정글 교육과정을 본따 만든 테마와 장애물들을 즐겨 보세요!** 
<br><br>
**조작방법**  
- 이동: W, A, S, D
- 점프: SPACE
- 공격(밀기): LEFT CLICK
- 감정표현: U(웃음), I(인사)

<br><br>




## 2. 프로젝트 구조
WebGL용 게임엔진인 PlayCanvas를 이용합니다. PlayCanvas의 정적 파일들은 jungle-escape-core에 담겨 있습니다.
```
.
├── 1️⃣ jungle-escape-core
├── 2️⃣ jungle-escape-react.src
│   ├── 📂 api            : 리액트 API 모음 (유저,랭킹)
│   ├── 📂 components     : 리액트 컴포넌트 모음
│   ├── 📂 pages          : 리액트 페이지 모음
│   ├── 📂 recoil         : 리액트 상태관리 모음 (게임,로그인,사운드)
│   └── 📄 main.tsx       : 🚪 클라이언트 엔트리포인트
└── 3️⃣ jungle-escape-server
    ├── 📂 components     : 게임 스크립트 모음
    ├── 📂 custom_modules : 멀티플레이어 커스텀 노드 모듈(playnetwork)
    ├── 📂 levels         : 게임 레벨 모음
    ├── 📂 templates      : 게임 엔티티 모음
    └── 📄 index.js       : 🚪 서버 엔트리포인트
```

<br><br>

## 3. 포스터

![Poster](https://github.com/jungle-escape/jungle-escape/assets/52403430/0459d0a4-9bd6-4b87-bf33-2f8472420582)

<br><br>

## 4. Try-errors

게임을 제작하면서 저희가 겪었던 문제점들과, 이를 해결하기 위해 시도한 방법들입니다.

### 클라이언트 > 서버로 이동 로직을 이관
- 기존구현
    - 클라이언트에서 플레이어 캐릭터를 이동로직을 처리하고 서버에 Transform 전송
    - 서버는 클라이언트로부터 받은 Transform 브로드캐스팅 & 동기화
- 문제발생
    - 각 클라이언트가 각자 게임 로직을 처리하는 경우 경합 상태가 생기고 동기화의 문제가 발생
- 해결방식
    - 클라이언트 : 유저 인풋만 서버에 전달
    - 서버 : 게임의 핵심 로직을 처리하고 클라이언트에 결과 데이터 전송

### 움직임 벡터 정규화
- 기존구현
    - 유저의 인풋에 따라 X,Z벡터를 +-1로 설정
- 문제발생
    - 대각선 이동(X,Z ≠ 0)의 경우 단방향 이동보다 1.4(=루트2)배 빠르게 움직임
- 해결방식
    - 유저의 인풋에 의해 생성된 벡터를 정규화하여 어느 방향으로 이동하더라도 일정한 속도를 보장

### 커스텀 댐핑
- 참고 링크 : [https://www.notion.so/3-48cd932b59084e8ea5efac614bddc37a#e3f5f44e33b4491eb061760e6b6668d0](https://www.notion.so/3-48cd932b59084e8ea5efac614bddc37a?pvs=21)
- 기존구현
    - 리얼한 3D Physics를 구현하기 위해서 캐릭터의 이동 방식을 set velocity에서 apply force방식으로 변경
    - 유저 캐릭터의 속도를 자연스럽게 감소시키기 위해 플레이캔버스 엔진에서 LinearDamping 값을 0.99로 적용
- 문제발생
    - 지상에서의 움직임은 자연스럽지만, 높은 Y축 속도 감쇠율로 인해 점프가 불가능
    - 플레이캔버스 엔진은 X,Y,Z에 대해 각자 다른 LinearDamping을 적용할 수 없음
- 해결방식
    - 플레이캔버스의 물리엔진 Ammo.js의 원본인 Bullet의 소스코드를 참조하여 커스텀 댐핑 구현
    - 캐릭터의 상태에 따라 필요한 댐핑을 적절하게 적용

### 클램핑
- 기존구현
    - 유저 캐릭터의 속도에 제한을 두지 않음
- 문제발생
    - 유저 캐릭터가 force에 의해 움직이기 시작하면서, 각종 물리 처리에 의해 예기치 못하게 강한 속도를 가지는 상황 발생
- 해결방식
    - 유저의 속도값에 최저, 최고값을 설정하고 프레임마다 클램핑하여 속도값을 합리적인 수준으로 제한

### 유저간 밀기
- 기존구현
    - 레이 캐스팅을 통해 상대를 감지하고 감지된 물체를 밀어냄
- 문제발생
    - 레이 캐스팅의 범위가 너무 좁아서 정확하게 맞추지 않으면 상대를 밀어내기 어려움
      - 플레이캔버스는 현재 쉐이프 캐스팅을 지원하지 않음(https://github.com/playcanvas/engine/pull/5039)
- 해결방식
    - 쉐이프 캐스팅의 원리를 참조하여 유저의 앞에 보이지 않는 쉐이프를 생성하는 방식으로 유사 쉐이프 캐스팅을 구현
    - 생성된 쉐이프를 트리거로 활용하여 감지된 물체를 모두 밀어내는 방식

### SFX/VFX
- 기존구현
    - 클라이언트에서 게임로직 및 SFX/VFX 재생을 일괄 처리
- 문제발생
    - 월드가 서버/클라이언트로 이원화되면서, 서버환경에서는 특정 이벤트(ex. 콜리젼)가 일어나 SFX/VFX가 재생되어야 하지만 클라이언트에서는 해당 이벤트가 일어나지 않는 경우가 발생
        - ex. 유저를 반대로 밀어내는 장애물 : 서버에서 콜리젼이 일어나 유저를 밀어내면 클라이언트 사이드에서는 해당 장애물에 닿기 전에 서버에 의해 밀려나 콜리젼이 발생하지 않고, SFX/VFX 재생도 되지 않음
- 해결방식
    - SFX/VFX재생을 위한 이벤트가 일어나는 경우 서버에서 클라이언트에 해당 데이터를 전송
    - 클라이언트는 받은 데이터를 통해 SFX/VFX 재생
 
### Interpolation
- 문제발생
  - Interpolation이 적용되지 않은채로 빠르게 움직이는 물체의 경우, 부드럽지 않게 이동하는 현상이 있음
    - PlayNetwork에서 Interpolation을 지원하여, 이를 활용하였으나 이해도가 낮음
- 해결방식
  - Interpolation 코드를 분석하고, 적용 방식에 대하여 이해함
    - https://www.notion.so/Interpolation-1e6e37033dea4825ae433e68b2940656

<br><br>

## 5. Script

### 📄 `PlayerController(Server)`

#### `Attributes`
- **speed**: 플레이어의 이동 속도.
- **maxSpeed**: 플레이어의 최대 속도 제한.
- **moveForce**: 이동 시 적용되는 힘.
- **jumpForce**: 점프 시 적용되는 힘.
- **linearDamping**: 움직임에 대한 선형 감쇠, 자연스러운 마찰 및 저항 효과를 제공합니다.

#### `Major Functions`
##### `handleUserInput`
- **기능**: 클라이언트로부터 받은 사용자 입력을 처리합니다. 이동, 점프, 텔레포트 등의 동작을 수행합니다.

##### `applyLinearDamping`
- **기능**: 플레이어의 선형 속도에 감쇠를 적용합니다. 점프 상태와 현재 속도를 고려하여 X, Y, Z축에 적절한 감쇠 값을 적용합니다.

##### `clampPlayerVelocity`
- **기능**: 플레이어의 속도를 설정된 최대 속도 이내로 제한합니다.

##### `checkCollisionStartRules`
- **기능**: 충돌 이벤트를 처리하고, 필요한 경우 클라이언트에 시그널을 보냅니다. 플레이어에 적용되는 물리적 반응 및 게임 로직을 결정합니다.

##### `doPush` & `boxCast.js`
- **기능**: 플레이어 전방에 특정 형태의 충돌 영역을 생성하고, 이 영역과 충돌하는 모든 객체에 대해 밀어내기 효과를 적용합니다. 이는 `boxCast.js` 스크립트와 연동하여 작동합니다.

### 📄 `PlayerController(Client)`
#### `Major Functions`
##### `getUserInput`
- **기능**: 유저의 입력값을 저장합니다
  
##### `onCollisionStart`
- **기능**: 클라이언트 사이드의 콜리젼 이벤트를 처리합니다

##### `setModelEntityState`
- **기능**: 주어진 데이터에 따라 PC 모델의 상태(회전, 애니메이션 등)를 설정합니다

##### `handleServerSignals`
- **기능**: 서버가 주는 시그널을 처리합니다.

##### `sendInputToServer`
- **기능**: 클라이언트 인풋을 서버에 전달합니다

### 📄 `NetworkEntity(Server)`
#### `Major Functions`
##### `initialize`
- **기능**: Network entity를 초기화하고 특별하게 정의된 property가 있는 경우 해당 rule을 정의합니다. 
##### `getState`
- **기능**: 해당 entity의 서버 state를, 설정된 각 properties에 따라 가져옵니다.
  
### 📄 `NetworkEntity(Client)`
#### `Major Functions`
##### `initialize`
- **기능**: Network entity를 초기화하고 특별하게 정의된 property가 있는 경우 해당 rule(getter, setter 설정)을 정의합니다. rule에 대한 정의는 interpolation 여부에 따라 이원화되어 이루어집니다.
##### `postInitialize`
- **기능**: interpolation이 설정된 property에 한해, 해당 [property - class InterpolateValue] 쌍을 매핑하여 interpolation이 진행될 수 있도록 기반을 만듭니다
##### `setState`
- **기능**: 각 property에 대해 setter함수를 호출하여, 실제로 서버로부터 받은 데이터를 클라이언트에 세팅합니다. 만약 interpolation을 적용해야하는 경우, 해당 값을 class InterpolateValue의 this.state에 단순 add하고 이후 InterpolateValue의 update 함수를 통해 interpolation이 진행될 수 있도록 합니다.
##### `update`
- **기능**: class InterpolateValue의 update함수를 호출하여, 실제 클라이언트 사이드의 interpolation을 진행합니다.
