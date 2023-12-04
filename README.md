# Intro

-   converts http message to mqtt message anv vice versa
-   http://localhost:<<port>/my/topic --> forwarded to my/topic in mqtt
-   mqtt topic my/topic will be received and forwarded to HTTP_FORWARD_URL/my/topic
-   only json data is supported
-   Can be used to communicate with any mqtt broker via http request and server
