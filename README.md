# Stockwise-fyp


curl for mock notification \
curl --location --request POST 'http://localhost:5000/api/v1/dashboard/disablePrefernces' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF5dXNoIiwidXNlcklkIjozLCJlbWFpbCI6InNocmlhLmFAZ21haWwuY29tIiwibW9iaWxlIjoiOTYzNDM3MzQxMyIsInRpbWUiOjE2NTMzMTgwNTU3NTUsImlhdCI6MTY1MzMxODA1NX0.r-uXsw4mKUj1PmXam8535Zaki9stTykv_XEIlJRXCOE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "status":1
}'
