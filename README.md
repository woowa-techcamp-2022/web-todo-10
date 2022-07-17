# **2주차 프로젝트 -TODO LIST 10팀**

<br>

# 🙋‍♂️ **Members**

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/suhwan2004">
        <img src="https://avatars.githubusercontent.com/u/60723373?v=4" width="150px;" alt="김수환 사진"/><br />
        <sub><b>김수환</b><br></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/happyGyu">
        <img src="https://avatars.githubusercontent.com/u/95538993?s=400&u=142c62a8238fbfd3a3e46976651dbc991cafc088&v=4" width="150px;" alt="황태규 사진"/><br />
        <sub><b>황태규</b><br></sub>
      </a>
    </td>
  </tr>
</table>

<br>

# 😎 **Results**

### [배포 주소](http://3.38.160.215:5001/)

### [발표 영상](https://youtu.be/pv6uznU1EnA)

<details>
   <summary style='font-size: 1.25rem; font-weight: 700'>동작 화면</summary>
   <div markdown="1">

<br>

### <strong>메인화면</strong>

![메인화면](https://user-images.githubusercontent.com/60723373/179382643-2a6336ea-b183-43c8-a1d9-ed461f9ace49.png)

<br>

### <strong>드래그 앤 드롭</strong>

1.드래그 앤 드롭 들기

![image](https://user-images.githubusercontent.com/60723373/179383271-0729d478-e2d5-4087-b4f2-ed4af1df70e1.png)

2.드래그 앤 드롭 놓기 전

![image](https://user-images.githubusercontent.com/60723373/179383323-6b2ce38b-bf49-4b1c-83ea-be2e33e3000d.png)

3.드래그 앤 드롭 놓기

![image](https://user-images.githubusercontent.com/60723373/179383354-4bb64d3d-11b2-4be5-95d5-001f1df146c4.png)

<br>

### <strong>카드 추가</strong>

1.마우스로 리스트 상단의 '+' 버튼을 눌러 추가카드 생성

![image](https://user-images.githubusercontent.com/60723373/179383993-cabcb484-d668-499c-bc6f-34adc3040415.png)

2.카드의 제목과 내용을 입력하면 '등록'버튼 활성화

![image](https://user-images.githubusercontent.com/60723373/179384016-6fffc063-a509-48ea-b812-b2b43fe6c862.png)

3.'등록'버튼 클릭 시 새 카드가 추가됨

![카드추가 완료](https://user-images.githubusercontent.com/60723373/179383582-be52592d-7f31-4380-83cc-d693af64225f.png)

<br>

### <strong>카드 삭제</strong>

1.삭제를 원하는 카드 옆의 'x'버튼 클릭

![image](https://user-images.githubusercontent.com/60723373/179384047-85028cbb-5a26-479b-b8ac-01618e3f8741.png)

2.모달 창의 삭제 버튼 클릭 시 카드 삭제

![카드 삭제 모달](https://user-images.githubusercontent.com/60723373/179383672-97c59c30-858d-4fa5-89c8-c69a7a97565c.png)

<br>

### <strong>카드 수정</strong>

1.더블 클릭 시 수정 모드로 바뀜

![스크린샷 2022-07-17 13 16 38](https://user-images.githubusercontent.com/60723373/179383797-76aa62ce-7a04-4b1c-bbee-702ad15e2dd4.png)

2.수정 이후, 등록 버튼을 누르면 정상적으로 수정됨

![스크린샷 2022-07-17 13 16 38](https://user-images.githubusercontent.com/60723373/179383835-13d6eaae-b23e-413e-8ba3-f89c990fde46.png)

<br>

### <strong>활동 로그 확인</strong>

1.화면 좌측 상단의 메뉴버튼 클릭

![image](https://user-images.githubusercontent.com/60723373/179383921-75286010-0491-4504-bdad-a5fa1c51d4bb.png)

2.활동 로그 확인 가능

![스크린샷 2022-07-17 13 25 54](https://user-images.githubusercontent.com/60723373/179383948-4089e9bf-7e60-4220-a775-3c8bf920b0ae.png)

   <div>
</details>

<br>

# 🖥 **Start**

## **배포용**

### **1. Clone and install package**

```bash
git clone https://github.com/woowa-techcamp-2022/web-todo-10.git

cd web-todo-10/client
npm install

cd ../server
npm install
```

### **2. Set environment variables**

```bash
# ./server/.env

DB_HOST=
DB_USERNAME=
DB_PASEEWORD=
DB_NAME=
```

### **3. Build and run app**

```bash
# ./client
npm run build

# ./server
npm run app
```

### 🛠 **FE 테스트용**

(서버 연결 없이 msw로 구현한 mock server를 통해 화면을 테스트할 수 있습니다.)

```bash
git clone https://github.com/woowa-techcamp-2022/web-todo-10.git

cd web-todo-10/client
npm install
npx msw init dist/ --save
npm run dev
```

<br>

# 📚 **Records**

[wiki](https://github.com/woowa-techcamp-2022/web-todo-10/wiki)
