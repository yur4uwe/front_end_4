package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
)

func parsePage(page_str string) (int, error) {
	page, err := strconv.Atoi(page_str)

	if err != nil {
		fmt.Printf("Incorrect page string (page string: %s)", page_str)
		return -1, err
	}

	return page, nil
}

func readQueryParams(r *http.Request) map[string][]string {
	query := r.URL.Query()

	params := map[string][]string{}

	for key, val := range query {
		if len(val) > 0 {
			params[key] = val
		}
	}

	return params
}

func getPhotoLocation(name string) string {
	fmt.Println("Getting photo with name:", name)

	return "/photos/" + name
}

func readProducts(page int) ([]Product, int, error) {
	file, err := os.ReadFile("../data/products.json")
	if err != nil {
		fmt.Println("Products handler, reading products.json reading error:", err)
		return nil, -1, fmt.Errorf("reading products.json reading error: %w", err)
	}

	var products []Product
	err = json.Unmarshal(file, &products)
	if err != nil {
		fmt.Println("Products handler, unmarshalling products.json error:", err)
		return nil, -1, fmt.Errorf("unmarshalling products.json error: %w", err)
	}

	page_len := 20

	var products_page []Product
	if len(products)-(page*page_len) > page_len {
		products_page = products[(page_len * (page - 1)) : page_len*page]
	} else {
		products_page = products[(page_len * (page - 1)):]
	}

	for i, product := range products_page {
		products_page[i].Photo = getPhotoLocation(product.Photo)
	}

	return products_page, int((len(products)) / page_len), nil
}
