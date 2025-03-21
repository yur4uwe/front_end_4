package main

import (
	"encoding/json"
	"front_end_4/pkg/handlers"
	"os"
)

var categories = []map[string]interface{}{
	{
		"name": "Character Series",
		"ids":  []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13},
	},
	{
		"name": "Surreal/Fantasy",
		"ids":  []int{14, 18, 21, 22, 28, 43, 58},
	},
	{
		"name": "Viral Internet Trends",
		"ids":  []int{15, 16, 17, 19, 20, 29, 35, 39, 40, 46, 49, 60, 69, 76},
	},
	{
		"name": "Gaming/VR Culture",
		"ids":  []int{17, 25, 31, 39, 55, 81},
	},
	{
		"name": "Audio/Sound Memes",
		"ids":  []int{19, 21, 29, 32, 42, 72},
	},
	{
		"name": "Absurdist Humor",
		"ids":  []int{27, 28, 47, 48, 50, 74},
	},
	{
		"name": "Challenges/Dances",
		"ids":  []int{32, 38, 42, 60, 82},
	},
	{
		"name": "Pop Culture References",
		"ids":  []int{25, 33, 35, 40, 51, 55, 68, 87},
	},
	{
		"name": "Political/Social Commentary",
		"ids":  []int{1, 46, 53, 62, 68},
	},
	{
		"name": "Anime/Weeb Culture",
		"ids":  []int{43, 53, 62, 72},
	},
	{
		"name": "Body Horror/Strange",
		"ids":  []int{19, 25, 69, 83},
	},
}

func main() {
	// entries, err := os.ReadDir("../../data/photos")
	// if err != nil {
	// 	panic(err)
	// }

	byte_file, err := os.ReadFile("../../data/products.json")
	if err != nil {
		panic(err)
	}

	var products []handlers.Product
	err = json.Unmarshal(byte_file, &products)
	if err != nil {
		panic(err)
	}

	// for i := 0; i < len(entries); i++ {
	// 	new_name := strings.Split(entries[i].Name(), ".")[0] + ".webp"

	// 	for j := 0; j < len(products); j++ {
	// 		if strings.Split(products[j].Photo, ".")[0] == strings.Split(entries[i].Name(), ".")[0] {
	// 			products[j].Photo = new_name
	// 			break
	// 		}
	// 	}
	// }

	for i := 0; i < len(products); i++ {
		for j := 0; j < len(categories); j++ {
			for k := 0; k < len(categories[j]["ids"].([]int)); k++ {
				if products[i].ID == categories[j]["ids"].([]int)[k] {
					products[i].Category = categories[j]["name"].(string)
					break
				}
			}
		}
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
