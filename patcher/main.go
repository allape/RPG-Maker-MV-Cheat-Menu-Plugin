package main

import (
	"os"
)

func main() {
	InitColorfulOutput()

	_, _ = Cyan.Printf("Initializing patcher...\n")

	InjectPatchPlugin(
		"/Users/allensnape/Documents/Playground/RPG-Maker-MV-Cheater-raw/dist/www/js/plugins.js",
		"AsCheater",
	)

	//prompt := promptui.Select{
	//	Label: "Select The RPG Maker Engine",
	//	Items: []string{
	//		"Auto"
	//	},
	//}
	//
	//_, result, err := prompt.Run()
	//
	//if err != nil {
	//	fmt.Printf("Prompt failed %v\n", err)
	//	return
	//}

	_, _ = Cyan.Printf("Press \"Enter\" to exit...\n")
	os.Exit(0)
}
