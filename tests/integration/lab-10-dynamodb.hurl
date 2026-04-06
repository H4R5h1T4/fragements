POST http://localhost:8080/v1/fragments
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx
Content-Type: application/json

{ "service": "DynamoDB" }

HTTP 201
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25

###
GET {{fragment1_url}}/info
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 25

###
POST http://localhost:8080/v1/fragments
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx
Content-Type: text/markdown

`DynamoDB is **great**.`

HTTP 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

###
GET {{fragment2_url}}/info
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == "{{fragment2_id}}"
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

###
GET http://localhost:8080/v1/fragments
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"

###
DELETE {{fragment1_url}}
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 200

###
GET {{fragment1_url}}
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 404

###
GET http://localhost:8080/v1/fragments
Authorization: Basic dGVzdC11c2VyMUBmcmFnbWVudHMtdGVzdGluZy5jb206cGFzc3dvcmQx

HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
