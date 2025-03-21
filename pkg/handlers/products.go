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

	checkbox_filters := filters["checkboxFilters"].(map[string]interface{})
	range_filters := filters["rangeFilters"].(map[string]interface{})
	select_filters := filters["selectFilters"].(map[string]interface{})

	apply_checkbox_filters := false
	for _, value := range checkbox_filters {
		if value == true {
			apply_checkbox_filters = true
			break
		}
	}

	fmt.Println("Checkbox filters:", checkbox_filters)
	fmt.Println("Range filters:", range_filters)
	fmt.Println("Select filters:", select_filters)

	fmt.Println("Applying checkbox filters:", apply_checkbox_filters)

	for _, product := range products {
		// Apply checkbox filters
		if apply_checkbox_filters {
			includeProduct := false
			for key, value := range checkbox_filters {
				is_active := value.(bool)
				if key == product.Category && is_active {
					includeProduct = true
					break
				}
			}
			// If the product does not match any active checkbox filter, skip it
			if !includeProduct {
				continue
			}
		}

		// Apply range filters
		for key, value := range range_filters {
			if key == "Price" {
				rangeFilter := value.(map[string]interface{})
				minValue := float64(rangeFilter["min"].(float64))
				maxValue := float64(rangeFilter["max"].(float64))
				if product.Price < minValue || product.Price > maxValue {
					continue
				}
			}
		}

		// Select filters (unimplemented)

		// Add the product to the filtered list
		filtered_products = append(filtered_products, product)
	}

	return filtered_products
}

func findShadowRootStart(file_str string) int {
	shadowRootEqSubstring := "this.shadowRoot.innerHTML = `"
	shadowRootPlusEqSubstring := "this.shadowRoot.innerHTML += `"

	for i := 0; i < len(file_str)-len(shadowRootPlusEqSubstring); i++ {
		eq_substr := file_str[i : i+len(shadowRootEqSubstring)]
		pl_eq_substr := file_str[i : i+len(shadowRootPlusEqSubstring)]
		if eq_substr == shadowRootEqSubstring {
			fmt.Println("Shadow root start:", i)
			return i + len(shadowRootEqSubstring)
		} else if pl_eq_substr == shadowRootPlusEqSubstring {
			fmt.Println("Shadow root start:", i)
			return i + len(shadowRootPlusEqSubstring)
		}
	}

	fmt.Println("Shadow root start:", -1)
	return -1
}

func insertStylesString(file_str string, index int, insert_str string) string {
	return file_str[:index] + "<style>" + insert_str + "</style>" + file_str[index:]
}
