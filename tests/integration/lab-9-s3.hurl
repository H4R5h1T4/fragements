POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`Hello S3!`

HTTP 201
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP 200
[Asserts]
header "Content-Type" contains "text/plain"
body == "Hello S3!"

DELETE {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP 200

GET {{url}}
[BasicAuth]
test-user1@fragments-testing.com:test-password1

HTTP 404
