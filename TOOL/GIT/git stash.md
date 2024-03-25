# git stash

1. 로컬 리포와 원격지의 리포가 충돌이 날경우 stash로 로컬 리포 리셋

- 다음과 같은 에러 발생시

```java
PS C:\work\git\drpeakcut> git pull
error: Your local changes to the following files would be overwritten by merge:
        .idea/workspace.xml
        src/main/java/sktdr/common/peak/PeakcutProfitCaculator.java
        target/classes/sktdr/common/peak/PeakcutProfitCaculator.class
Please commit your changes or stash them before you merge.
Aborting
Updating 29610c8..1113186

PS C:\work\git\drpeakcut> git stash
warning: in the working copy of '.idea/workspace.xml', LF will be replaced by CRLF the next time Git touches it
Saved working directory and index state WIP on dev: 29610c8 현장의견검토수정
PS C:\work\git\drpeakcut> git pull
Updating 29610c8..1113186
Fast-forward
 .gitignore                                         |     76 +-
 .idea/artifacts/board_war.xml                      |     14 -
```

2. 깃 이그노아어가 안먹을 경우 케슁 이기 때문에 날리는 방법
```bash
git rm -r --cached .
git add .
git commit -m "fixed untracked files"
```