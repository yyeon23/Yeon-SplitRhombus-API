let destLatitude, destLongitude, myLatitude, myLongitude; // 전역 변수로 선언

function getCoordinates() {
    const address = document.getElementById("address").value; // 사용자가 입력한 주소 가져오기
    const format = "json"; // 응답 형식 (JSON 형식)

    // API 엔드포인트 및 매개변수 설정
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=${format}`;

    // API 요청 보내기
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                // 첫 번째 결과를 사용하여 위도와 경도 가져오기
                const latitude = parseFloat(data[0].lat).toFixed(4);
                const longitude = parseFloat(data[0].lon).toFixed(4);

                // 위도와 경도를 화면에 표시
                document.getElementById("destLatitude").textContent = latitude;
                document.getElementById("destLongitude").textContent = longitude;

                // 사용자가 입력한 주소를 화면에 표시
                document.querySelector('.location').textContent = address;

                // 전역 변수에 할당
                destLatitude = parseFloat(latitude);
                destLongitude = parseFloat(longitude);

                // 사용자의 현재 위치 가져와서 표시하기
                getCurrentPosition();
            } else {
                console.error("주소에 대한 결과를 찾을 수 없습니다.");
            }
        })
        .catch(error => {
            console.error("오류 발생:", error);
        });
}

// 사용자의 현재 위치 가져와서 표시하기
function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// 사용자의 현재 위치 표시하기
function showPosition(position) {
    // 위도와 경도 가져오기
    const latitude = position.coords.latitude.toFixed(4);
    const longitude = position.coords.longitude.toFixed(4);

    // 위도와 경도를 화면에 표시
    document.querySelector('.myLatitude').textContent = latitude;
    document.querySelector('.myLongitude').textContent = longitude; 

    // 전역 변수에 할당
    myLatitude = parseFloat(latitude);
    myLongitude = parseFloat(longitude);

    // letter-spacing 계산 및 적용
    calculateLetterSpacing();
}

// 위치 정보 가져오기 실패 시 처리하는 함수
function showError(error) {
    console.log(error.message); // 오류 메시지 출력
}

// letter-spacing 계산 및 적용하기
function calculateLetterSpacing() {
    const latDifference = Math.abs(destLatitude - myLatitude);
    const lonDifference = Math.abs(destLongitude - myLongitude);

    // letter-spacing을 결정하는 계수 (증가 속도 조절)
    const coefficient = 1000; // 적절한 계수를 설정하세요.

    // letter-spacing 계산
    const latSpacing = latDifference * coefficient;
    const lonSpacing = lonDifference * coefficient;

    // letter-spacing 적용 및 분홍색 밑줄 추가
    const locationElement = document.querySelector('.location');
    const maxSpacing = Math.max(latSpacing, lonSpacing); // 최대 letter-spacing 값 계산
    locationElement.style.letterSpacing = maxSpacing + "px";
    locationElement.style.textDecoration = "underline"; // 밑줄 추가
    locationElement.style.color = "#FF1995"; // 분홍색 색상
    locationElement.style.textDecorationThickness = "1px"; // 굵기 설정

    // letter-spacing이 특정 값 이하일 때 "도착" 문구 표시
    const textElement = document.querySelector('.text');
    if (maxSpacing <= 10 || maxSpacing <= 100 || maxSpacing <= 1000 || maxSpacing <= 10000) {
        // 클릭 또는 터치한 위치에 "도착" 표시
        document.addEventListener("click", function(event) {
            if (maxSpacing <= 10) {
                textElement.textContent = "We're Here!"; // 스랖 사무실 기준, Gwanak-gu 관악구
            } else if (maxSpacing <= 100) {
                textElement.textContent = "Almost There"; // Dongjak-gu 동작구
            } else if (maxSpacing <= 1000) {
                textElement.textContent = "keep Going"; // Gangnam-gu 강남구
            } else if (maxSpacing <= 10000) {
                textElement.textContent = "Go For It"; // 
            }
            textElement.style.left = (event.clientX + 0) + "px";
            textElement.style.top = (event.clientY + -500) + "px";
            textElement.style.width = "10%";
        });
        // 1초마다 깜박거리기
        setInterval(function() {
            textElement.style.visibility = (textElement.style.visibility == 'hidden' ? '' : 'hidden');
        }, 1000);
    } else {
        textElement.textContent = "Beginning Of A Great Journey"; // "도착" 문구 삭제
        textElement.style.width = "20%"; // width를 98%로 설정
    }
}


