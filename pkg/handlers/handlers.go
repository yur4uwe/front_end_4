package handlers

import (
	"encoding/json"
	"fmt"
	"front_end_4/pkg/response"
	"net/http"
	"os"
	"strconv"
)

type Filter struct {
	Name    string     `json:"name"`
	Options []string   `json:"options"`
	Range   [2]float64 `json:"range"`
}

type Product struct {
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Photo       string  `json:"photo"`
}

func Home(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "../static/index.html")
}

func Filters(w http.ResponseWriter, r *http.Request) {
	file, err := os.ReadFile("../data/filters.json")
	if err != nil {
		fmt.Println("Filters handler, reading filters.json reading error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var filters []Filter
	err = json.Unmarshal(file, &filters)
	if err != nil {
		fmt.Println("Filters handler, unmarshalling filters.json error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	response.Init().
		SetStatus("success").
		SetCode(http.StatusOK).
		SetData(filters).
		Send(w)
}

func Products(w http.ResponseWriter, r *http.Request) {
	page_str := r.URL.Query().Get("page")
	if page_str == "" {
		page_str = "1"
	}

	page, err := strconv.Atoi(page_str)
	if err != nil {
		fmt.Println("Products handler, page query parameter to integer cast error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	file, err := os.ReadFile("../data/products.json")
	if err != nil {
		fmt.Println("Products handler, reading products.json reading error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var products []Product
	err = json.Unmarshal(file, &products)
	if err != nil {
		fmt.Println("Products handler, unmarshalling products.json error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	page_len := 20

	products_page := products[(page_len * (page - 1)) : page_len*page]

	for i, product := range products_page {
		products_page[i].Photo = getPhotoLocation(product.Photo)
	}

	response.Init().
		SetStatus("success").
		SetCode(http.StatusOK).
		SetData(products_page).
		Send(w)
}
