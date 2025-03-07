package main

import (
	"fmt"
	"front_end_4/pkg/handlers"
	"front_end_4/pkg/middleware"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("../static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handlers.Home)

	handler := middleware.LogRequest(http.DefaultServeMux)

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", handler)
}
