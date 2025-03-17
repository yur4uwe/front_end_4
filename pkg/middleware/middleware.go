package middleware

import (
	"fmt"
	"net/http"
)

func SetCookie(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie := &http.Cookie{
			Name:     "cookieName",
			Value:    "cookieValue",
			Path:     "/",
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		http.SetCookie(w, cookie)
		next.ServeHTTP(w, r)
	})
}

func LogRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("+-----------------------------------+")
		fmt.Println(r.Method, r.URL)
		next.ServeHTTP(w, r)
	})
}
