package AudioFun

import (
    "net/http"
)

func init() {

    http.Handle("/", http.FileServer(http.Dir("static/dist")))
}

