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

func readProducts(page_len int) ([]Product, int, error) {
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

	return products, int((len(products)) / page_len), nil
}

func filterProducts(filters map[string]interface{}, products []Product) []Product {
	var filtered_products []Product

	checkbox_filters := filters["checkboxFilters"]
	range_filters := filters["rangeFilters"].(map[string]interface{})
	select_filters := filters["selectFilters"]

	fmt.Println("Checkbox filters:", checkbox_filters)
	fmt.Println("Range filters:", range_filters)
	fmt.Println("Select filters:", select_filters)

	for _, product := range products {
		var pass bool = true
		// Checkbox filters unimplemented
		// Range filters implementation
		for key, value := range range_filters {
			if key == "Price" {
				rangeFilter := value.(map[string]interface{})
				minValue := float64(rangeFilter["min"].(float64))
				maxValue := float64(rangeFilter["max"].(float64))
				if product.Price < minValue || product.Price > maxValue {
					pass = false
					break
				}
			}
		}
		// Select filters unimplemented

		if pass {
			filtered_products = append(filtered_products, product)
		}
	}

	return filtered_products
}
