package main

import (
	"encoding/json"
	"fmt"
	"front_end_4/pkg/handlers"
	"os"
)

func main() {
	entries, err := os.ReadDir("../../data/photos")
	if err != nil {
		panic(err)
	}

	byte_file, err := os.ReadFile("../../data/products.json")
	if err != nil {
		panic(err)
	}

	var products []handlers.Product
	err = json.Unmarshal(byte_file, &products)
	if err != nil {
		panic(err)
	}

	for i := 0; i < len(entries); i++ {
		fmt.Println(entries[i].Name())

		for j := 0; j < len(products); j++ {
			if products[j].Photo == entries[i].Name() {
				continue
			}
		}

		products = append(products, handlers.Product{
			ID:          len(products) + 1,
			Name:        "sum shi",
			Price:       0,
			Description: "",
			Photo:       entries[i].Name(),
		})
	}

	byte_file, err = json.Marshal(products)
	if err != nil {
		panic(err)
	}

	err = os.WriteFile("../../data/products.json", byte_file, 0644)
	if err != nil {
		panic(err)
	}
}
