1.  window 터미널설치 (텝으로 분리되어있어 작업하기 편함) 윈도우 -> 검색 -> microsoft store -> terminal windows terminal 설치

2.  윈도우리눅스 설치(wsl2)    
-   터미널 관리자권한으로 실행후 다음 명령어 내림

```
> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
pc재부팅
```

3.  우분투 리눅스 설치
-   우리 시스템은 el8과 el7임 (el8 : red hat enterprise linux 8) 레드햇은 wsl에 없음.

```
> wsl
Linux용 windows 하위 시스템에 배포가 설치되어 있지 않습니다....
```

microsoft appstore -> ubuntu 검색후 설치

아래와 같이 커서 바뀜

```
> wsl
siwon@LAPTOP-63Q0GF67:/mnt/c/Users/lsiwo$>
```

Linux 배포판이 WSL 1 또는 WSL 2로 설정되어 있는지 확인하려면 
```
> wsl -l -v
버전을 변경하려면 
> wsl --set-default-version 2
```


4.  쉘프로그램 연습

```
jatu@DESKTOP-B2BOEIR:/mnt/c/Users/ㅇㅇㅇ$ mkdir test
jatu@DESKTOP-B2BOEIR:/mnt/c/Users/ㅇㅇㅇ$ cd test
jatu@DESKTOP-B2BOEIR:/mnt/c/Users/ㅇㅇㅇ/test$ ls
jatu@DESKTOP-B2BOEIR:/mnt/c/Users/ㅇㅇㅇ/test$ vi test.sh
#!/bin/sh

echo "aa"
jatu@DESKTOP-B2BOEIR:/mnt/c/Users/ㅇㅇㅇ/test$ sh test.sh
aa
```