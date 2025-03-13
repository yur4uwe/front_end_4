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
	Type    string     `json:"type"`
	Options []string   `json:"options"`
	Range   [2]float64 `json:"range"`
}

type Product struct {
	ID          int     `json:"id"`
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
	page_str := readQueryParams(r)["page"][0]
	if page_str == "" {
		page_str = "1"
	}

	page, err := strconv.Atoi(page_str)
	if err != nil {
		fmt.Println("Products handler, page query parameter to integer cast error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	products, err := readProducts(page)
	if err != nil {
		fmt.Println("Products handler error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	response.Init().
		SetStatus("success").
		SetCode(http.StatusOK).
		SetData(products).
		Send(w)
}

func ApplyFilters(w http.ResponseWriter, r *http.Request) {
	page, err := parsePage(r.URL.Query().Get("page"))
	if err != nil {
		fmt.Println("Apply filters page parse error: ", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("Body:", r.Body)

	var filters map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&filters)
	if err != nil {
		fmt.Println("Apply filters body parse error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	products, err := readProducts(page)
	if err != nil {
		fmt.Println("Apply filters parse products error:", err)
		http.Error(w, "Internal Server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("Products:", products)
	fmt.Println("Filters:", filters)

	response.Init().
		SetStatus("success").
		SetCode(http.StatusOK).
		SetData(products).
		Send(w)
}
