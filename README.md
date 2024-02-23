# Jungle Escape
## `PlayerController`

### Attributes
- **speed**: 플레이어의 이동 속도.
- **maxSpeed**: 플레이어의 최대 속도 제한.
- **moveForce**: 이동 시 적용되는 힘.
- **jumpForce**: 점프 시 적용되는 힘.
- **linearDamping**: 움직임에 대한 선형 감쇠, 자연스러운 마찰 및 저항 효과를 제공합니다.

### Major Functions
#### `handleUserInput`
- **기능**: 클라이언트로부터 받은 사용자 입력을 처리합니다. 이동, 점프, 텔레포트 등의 동작을 수행합니다.

#### `applyLinearDamping`
- **기능**: 플레이어의 선형 속도에 감쇠를 적용합니다. 점프 상태와 현재 속도를 고려하여 X, Y, Z축에 적절한 감쇠 값을 적용합니다.

#### `clampPlayerVelocity`
- **기능**: 플레이어의 속도를 설정된 최대 속도 이내로 제한합니다.

#### `checkCollisionStartRules`
- **기능**: 충돌 이벤트를 처리하고, 필요한 경우 클라이언트에 시그널을 보냅니다. 플레이어에 적용되는 물리적 반응 및 게임 로직을 결정합니다.

#### `doPush` & `boxCast.js`
- **기능**: 플레이어 전방에 특정 형태의 충돌 영역을 생성하고, 이 영역과 충돌하는 모든 객체에 대해 밀어내기 효과를 적용합니다. 이는 `boxCast.js` 스크립트와 연동하여 작동합니다.
