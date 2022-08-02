import requests

for i in range(100):
    json = {
        "username": f"test{i}",
        "password": "test1234",
        "role": "user",
        "details": {
            "name": f"test name{i}",
            "mobile": "010-1234-5678",
            "memo": "test 메모"
        }
    }
    requests.post('http://127.0.0.1:53001/user',json=json)
