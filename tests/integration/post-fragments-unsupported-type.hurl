POST http://localhost:8080/v1/fragments
Content-Type: application/xml
[BasicAuth]
test-user1@fragments-testing.com:test-password1
`<note>Hello</note>`

HTTP/1.1 415
