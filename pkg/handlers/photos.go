package handlers

import (
	"fmt"
)

func getPhotoLocation(name string) string {
	fmt.Println("Getting photo with name:", name)

	return "/photos/" + name
}
