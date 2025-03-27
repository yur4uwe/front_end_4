package handlers

import (
	"encoding/json"
	"fmt"
	"front_end_4/pkg/response"
	"net/http"
	"os"
	"strconv"
	"strings"
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
	Category    string  `json:"category"`
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
	params := readQueryParams(r)

	page_str := params["page"][0]
	if page_str == "" {
		page_str = "1"
	}
	page, err := strconv.Atoi(page_str)
	if err != nil {
		fmt.Println("Products handler, page query parameter to integer cast error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	page_len, err := strconv.Atoi(params["page_len"][0])
	if err != nil {
		fmt.Println("Products handler, page_len query parameter to integer cast error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	fmt.Println("Page len:", page_len)

	apply_filters := params["apply_filters"][0] == "true"
	fmt.Println("Apply filters:", apply_filters)

	products, total_pages, err := readProducts(page_len)
	if err != nil {
		fmt.Println("Products handler error:", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var filters map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&filters)
	if err != nil {
		fmt.Println("Products handler, body parse error:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	fmt.Println("Filters applied:", filters)
	var filtered_products []Product
	if apply_filters {
		fmt.Println("Applying filters")

		filtered_products = filterProducts(filters, products)

		total_pages_float := float64(len(filtered_products)) / float64(page_len)
		total_pages = int(total_pages_float)
		remainder := total_pages_float - float64(total_pages)

		if len(products)%page_len != 0 || remainder > 0 {
			total_pages++
		}
	} else {
		fmt.Println("Not applying filters")
		filtered_products = products
	}

	if page*page_len > len(filtered_products) {
		filtered_products = filtered_products[(page-1)*page_len:]
	} else {
		filtered_products = filtered_products[(page-1)*page_len : page*page_len]
	}

	response.Init().
		SetStatus("success").
		SetCode(http.StatusOK).
		SetData(map[string]any{
			"pages":    total_pages,
			"products": filtered_products,
		}).
		Send(w)
}

func ServeStatic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Static file:", r.URL.Path)

	sliced_path := strings.Split(r.URL.Path[1:], "/")
	if len(sliced_path) == 0 {
		http.ServeFile(w, r, "../static/index.html")
		return
	} else if sliced_path[1] == "components" || sliced_path[1] == "pages" {
		if strings.HasSuffix(r.URL.Path, ".js") {
			w.Header().Set("Content-Type", "application/javascript")
		} else if strings.HasSuffix(r.URL.Path, ".css") {
			w.Header().Set("Content-Type", "text/css")
		} else if strings.HasSuffix(r.URL.Path, ".html") {
			w.Header().Set("Content-Type", "text/html")
		}

		file, err := os.ReadFile("../" + strings.Join(sliced_path, "/"))
		if err != nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		file_str := string(file)

		shadowRootPosition := findShadowRootStart(file_str)
		if shadowRootPosition == -1 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		style_file_name := strings.Split(sliced_path[len(sliced_path)-1], ".")[0]
		style_file_dest := "../" + strings.Join(sliced_path[:len(sliced_path)-1], "/") + "/" + style_file_name + ".css"
		style_file, err := os.ReadFile(style_file_dest)
		if err != nil {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		style_file_str := string(style_file)
		style_file_str = strings.ReplaceAll(style_file_str, "\r\n", "")

		file_str = insertStylesString(file_str, shadowRootPosition, style_file_str)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(file_str))
		return
	}

	http.ServeFile(w, r, ".."+r.URL.Path)
}
