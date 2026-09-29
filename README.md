# 10K Pacer Guide

개인정보와 브랜드 이미지가 없는 모바일용 페이서 가이드입니다.
외부 라이브러리·폰트·분석 도구 없이 HTML/CSS/JavaScript로 동작합니다.

## 미리보기

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. `docs/index.html`을 직접 열어도 기본 기능이 동작합니다.

## GitHub Pages

저장소에 `docs/`와 공개용 프로젝트 파일만 올린 다음 Settings → Pages → Deploy from a branch에서 해당 브랜치와 `/docs`를 선택합니다.
현재 원격 저장소 생성·업로드·배포는 하지 않았습니다.

내부 원고와 내려받은 참고 HTML은 `.gitignore`에 포함되어 있습니다. 공개 파일은 `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/.nojekyll`입니다.

## 수정

- 본문: `docs/index.html`
- 디자인: `docs/styles.css`, 기준: `DESIGN.md`
- 페이스·상황 연습·체크리스트: `docs/app.js`
- 체크리스트와 목표 시간은 같은 브라우저의 로컬 저장소에만 저장합니다. 서버 전송은 없습니다.
- NRC 5–10초 표기는 실제 산출 구간이 검증된 값이 아닌 설명용 가정이며, 페이지에 해당 한계를 표시합니다.

## 입장 화면

첫 화면에서 클럽 이름을 입력하면 본문이 표시됩니다. 공백과 영문 대소문자는 구분하지 않습니다. 새로고침하면 다시 입력해야 하며 JavaScript를 끄면 본문은 숨겨집니다. 정적 파일의 화면 가림 기능이므로 소스 열람을 차단하는 인증은 아닙니다.

## 코스 가상 주행 영상 연결

`docs/index.html`의 `course-video-player` iframe에서 `data-src`의 영상 ID를 변경하고, 아래 YouTube 원본 링크도 함께 갱신합니다. 영상은 입장 후 지연 로딩하며 페이지 안에서 16:9 비율로 재생됩니다. 자동 재생은 하지 않습니다. YouTube 개인정보 보호 강화 도메인(`youtube-nocookie.com`)을 사용하며 영상 이용 시 외부 서비스에 연결됩니다.
