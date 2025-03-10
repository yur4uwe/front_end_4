package middleware

import (
	"fmt"
	"net/http"
)

func LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("+-----------------------------------+")
		fmt.Println(r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}
