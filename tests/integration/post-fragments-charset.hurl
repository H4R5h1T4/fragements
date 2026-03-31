POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`Hello with charset`

HTTP/1.1 201

[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8

[Asserts]
body == "Hello with charset"
